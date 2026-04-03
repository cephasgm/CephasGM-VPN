const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { pool } = require('../config/db');

class WireGuardService {
  // Generate client keypair and assign next free IP from subnet
  static async generateClientConfig(userId, serverId) {
    // Generate keys
    const { stdout: privKey } = await execPromise('wg genkey');
    const { stdout: pubKey } = await execPromise(`echo "${privKey}" | wg pubkey`);
    
    // Get server details
    const serverRes = await pool.query('SELECT * FROM servers WHERE id = $1', [serverId]);
    const server = serverRes.rows[0];
    
    // Assign next IP (10.0.0.x) – simplistic, should track used IPs
    const usedRes = await pool.query('SELECT assigned_ip FROM vpn_configs WHERE server_id = $1', [serverId]);
    const usedIPs = usedRes.rows.map(r => parseInt(r.assigned_ip.split('/')[0].split('.').pop()));
    let nextIP = 2;
    while (usedIPs.includes(nextIP)) nextIP++;
    const clientIP = `10.0.0.${nextIP}/32`;
    
    // Build config text
    const configText = `[Interface]
PrivateKey = ${privKey.trim()}
Address = ${clientIP}
DNS = 1.1.1.1

[Peer]
PublicKey = ${server.public_key}
Endpoint = ${server.endpoint}
AllowedIPs = ${server.allowed_ips}
PersistentKeepalive = 25
`;
    
    // Save to DB
    const insertRes = await pool.query(
      `INSERT INTO vpn_configs (user_id, server_id, client_private_key, client_public_key, assigned_ip, config_text)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, serverId, privKey.trim(), pubKey.trim(), clientIP, configText]
    );
    
    return { id: insertRes.rows[0].id, config: configText, clientIP, clientPublicKey: pubKey.trim() };
  }
  
  // Optional: add peer to server's WireGuard interface (call via SSH or local exec)
  static async addPeerToServer(serverId, clientPubKey, clientIP) {
    // This would normally run on the VPN server (e.g., via SSH or API)
    // For demo, assume we run locally: wg set wg0 peer <pubkey> allowed-ips <clientIP>
    const cmd = `wg set wg0 peer ${clientPubKey} allowed-ips ${clientIP}`;
    try {
      await execPromise(cmd);
    } catch (err) {
      console.error('Failed to add peer to server', err);
    }
  }
}

module.exports = WireGuardService;
