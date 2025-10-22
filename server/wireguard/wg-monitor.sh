#!/bin/bash

# CephasGM VPN WireGuard Monitor Script
echo "📊 WireGuard VPN Monitor"
echo "========================"

# Check if WireGuard is running
if systemctl is-active --quiet wg-quick@wg0; then
    echo "✅ WireGuard is running"
else
    echo "❌ WireGuard is not running"
    exit 1
fi

# Show interface status
echo ""
echo "🌐 Interface Status:"
wg show

# Show connected clients
echo ""
echo "👥 Connected Clients:"
wg show wg0 endpoints | while read -r line; do
    if [[ $line == *"allowed ips"* ]]; then
        continue
    fi
    if [[ ! -z $line ]]; then
        CLIENT_IP=$(echo $line | cut -d' ' -f2)
        echo "  📍 $CLIENT_IP - Connected"
    fi
done

# Show transfer statistics
echo ""
echo "📈 Transfer Statistics:"
wg show wg0 transfer

# Log the monitoring activity
echo "$(date): VPN monitoring check completed" >> /var/log/cephasgm-vpn.log