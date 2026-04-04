#!/bin/bash
# Usage: ./generate-client.sh <client_name> [server_config_path]
# Example: ./generate-client.sh alice /etc/wireguard/wg0.conf

set -e

CLIENT_NAME=$1
SERVER_CONF=${2:-/etc/wireguard/wg0.conf}
CLIENT_DIR="./clients/${CLIENT_NAME}"
WG_QUICK=$(which wg-quick)
WG=$(which wg)

if [ -z "$CLIENT_NAME" ]; then
    echo "Error: client_name required"
    exit 1
fi

# Create client directory
mkdir -p "$CLIENT_DIR"
cd "$CLIENT_DIR"

# Generate keys
umask 077
wg genkey | tee privatekey | wg pubkey > publickey
PRIVATE_KEY=$(cat privatekey)
PUBLIC_KEY=$(cat publickey)

# Find next available IP from server's subnet (assumes 10.0.0.0/24)
SERVER_SUBNET="10.0.0.0/24"
LAST_USED=$(sudo grep -E "AllowedIPs = 10\.0\.0\.[0-9]+/32" "$SERVER_CONF" | sed -E 's/.*10\.0\.0\.([0-9]+)\/32.*/\1/' | sort -n | tail -1)
NEXT_IP=$((LAST_USED + 1))
if [ -z "$NEXT_IP" ] || [ "$NEXT_IP" -lt 2 ]; then
    NEXT_IP=2
fi
CLIENT_IP="10.0.0.${NEXT_IP}/32"

# Get server public key and endpoint
SERVER_PUB_KEY=$(sudo grep -E "^PrivateKey" "$SERVER_CONF" -B1 | head -1 | awk '{print $3}')
if [ -z "$SERVER_PUB_KEY" ]; then
    # Alternative: read from wg show
    SERVER_PUB_KEY=$(sudo wg show wg0 private-key | xargs wg pubkey)
fi
SERVER_ENDPOINT=$(sudo grep -E "^Endpoint" "$SERVER_CONF" | head -1 | awk '{print $3}')
if [ -z "$SERVER_ENDPOINT" ]; then
    SERVER_ENDPOINT="vpn.example.com:51820"
fi

# Build client config
cat > "${CLIENT_NAME}.conf" <<EOF
[Interface]
PrivateKey = ${PRIVATE_KEY}
Address = ${CLIENT_IP}
DNS = 1.1.1.1

[Peer]
PublicKey = ${SERVER_PUB_KEY}
Endpoint = ${SERVER_ENDPOINT}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

# Add peer to server config (append to wg0.conf)
PEER_BLOCK="[Peer]\nPublicKey = ${PUBLIC_KEY}\nAllowedIPs = ${CLIENT_IP}"
if ! sudo grep -q "$PUBLIC_KEY" "$SERVER_CONF"; then
    echo -e "$PEER_BLOCK" | sudo tee -a "$SERVER_CONF" > /dev/null
    echo "Added peer to $SERVER_CONF"
    
    # Safely reload WireGuard without dropping existing connections
    sudo wg syncconf wg0 <(sudo wg-quick strip wg0)
    echo "WireGuard interface reloaded"
else
    echo "Peer already exists, skipping."
fi

echo "Client config generated at $CLIENT_DIR/${CLIENT_NAME}.conf"
echo "Use this file on client device to connect."
