#!/bin/bash

# CephasGM VPN WireGuard Setup Script
set -e

WG_INTERFACE="wg0"
WG_PORT="51820"
WG_CONFIG="/etc/wireguard/$WG_INTERFACE.conf"

echo "🔧 Setting up WireGuard VPN..."

# Install WireGuard
if command -v apt-get &> /dev/null; then
    echo "📦 Installing WireGuard (Ubuntu/Debian)..."
    apt-get update
    apt-get install -y wireguard
elif command -v yum &> /dev/null; then
    echo "📦 Installing WireGuard (CentOS/RHEL)..."
    yum install -y wireguard-tools
else
    echo "❌ Unsupported package manager. Please install WireGuard manually."
    exit 1
fi

# Generate server keys
echo "🔑 Generating server keys..."
mkdir -p /etc/wireguard
cd /etc/wireguard

if [ ! -f "privatekey" ]; then
    wg genkey | tee privatekey | wg pubkey > publickey
    chmod 600 privatekey
    echo "✅ Server keys generated"
else
    echo "⚠️  Server keys already exist, skipping generation"
fi

SERVER_PRIVATE_KEY=$(cat privatekey)
SERVER_PUBLIC_KEY=$(cat publickey)

# Create server configuration
echo "📁 Creating WireGuard configuration..."
cat > $WG_CONFIG << EOF
[Interface]
PrivateKey = $SERVER_PRIVATE_KEY
Address = 10.8.0.1/24
ListenPort = $WG_PORT
SaveConfig = true
PostUp = iptables -A FORWARD -i $WG_INTERFACE -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i $WG_INTERFACE -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

EOF

echo "✅ WireGuard configuration created at $WG_CONFIG"
echo "📋 Server Public Key: $SERVER_PUBLIC_KEY"

# Enable IP forwarding
echo "🌐 Enabling IP forwarding..."
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p

# Start and enable WireGuard
echo "🚀 Starting WireGuard service..."
systemctl enable wg-quick@$WG_INTERFACE
systemctl start wg-quick@$WG_INTERFACE

# Check status
echo "📊 Checking WireGuard status..."
wg show

echo ""
echo "✅ WireGuard setup complete!"
echo "🌐 Server is running on port $WG_PORT"
echo "🔑 Public Key: $SERVER_PUBLIC_KEY"
echo "💡 Add this public key to your client configurations"