#!/bin/bash

# Script to add new VPN server
echo "🌍 Adding new VPN server to CephasGM VPN..."

if [ -z "$1" ]; then
    echo "Usage: ./add_server.sh <server-name> <location> <ip-address>"
    echo "Example: ./add_server.sh asia-sg Singapore 103.1.2.3"
    exit 1
fi

SERVER_NAME=$1
LOCATION=$2
IP_ADDRESS=$3

echo "🔧 Setting up server: $SERVER_NAME"
echo "📍 Location: $LOCATION"
echo "🌐 IP Address: $IP_ADDRESS"

# Create server directory
mkdir -p ../configs/$SERVER_NAME
echo "✅ Created config directory: ../configs/$SERVER_NAME"

# Generate sample server config
cat > ../configs/$SERVER_NAME/wg0.conf << EOF
# CephasGM VPN - $SERVER_NAME Configuration
# Location: $LOCATION
# IP: $IP_ADDRESS

[Interface]
PrivateKey = <server-private-key>
Address = 10.8.0.1/24
ListenPort = 51820
SaveConfig = true

# Add your server configuration here
EOF

echo "✅ Created sample WireGuard config"
echo "📋 Next steps:"
echo "1. Deploy WireGuard on your server"
echo "2. Update the configuration with real keys"
echo "3. Add server to dashboard via API"
echo ""
echo "🎯 Server '$SERVER_NAME' setup completed!"