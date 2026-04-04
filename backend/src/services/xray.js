class XrayService {
  static generateClientLink(userId, serverDomain = 'vpn.cephasgm.com') {
    const uuid = process.env.XRAY_UUID || '71226db2-b1b8-4d94-9791-623b5c0c7851';
    // Use port 8443 (since Xray now listens there)
    const link = `vless://${uuid}@${serverDomain}:8443?security=tls&flow=xtls-rprx-vision&encryption=none&sni=${serverDomain}#CephasGM-Xray`;
    return link;
  }
}
module.exports = XrayService;
