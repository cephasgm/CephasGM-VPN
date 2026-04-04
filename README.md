# 🚀 CephasGM VPN Platform – Complete Documentation (Phases 1–5)

**A production‑ready, anti‑censorship VPN service** with WireGuard, Xray VLESS+XTLS, Stripe billing, free tier, Cloudflare fronting, and a React PWA.

---

## 📦 Project Overview

| Phase | Focus |
|-------|-------|
| **Phase 1** | AWS VPS setup, WireGuard VPN, Node.js backend, PostgreSQL, static HTML frontend |
| **Phase 2** | Domain registration, Let’s Encrypt SSL, Xray VLESS+XTLS (anti‑censorship) |
| **Phase 3** | React PWA (installable), automatic peer addition, improved dashboard |
| **Phase 4** | Xray on port 443, fallback website, client rotation (optional) |
| **Phase 5** | Cloudflare domain fronting, Stripe billing, free tier with bandwidth limiting, multiple Xray protocols (gRPC, WebSocket) |

All components are **production‑ready**, **tested**, and **running live** at [https://vpn.cephasgm.com](https://vpn.cephasgm.com).

---

## 🌐 Live URLs & Endpoints

| Resource | URL |
|----------|-----|
| **Static landing page** | [https://vpn.cephasgm.com/](https://vpn.cephasgm.com/) |
| **Login / Signup** | [https://vpn.cephasgm.com/login.html](https://vpn.cephasgm.com/login.html) |
| **Dashboard (WireGuard + Xray)** | [https://vpn.cephasgm.com/dashboard.html](https://vpn.cephasgm.com/dashboard.html) |
| **Subscription page** | [https://vpn.cephasgm.com/subscription.html](https://vpn.cephasgm.com/subscription.html) |
| **React PWA (installable)** | [https://vpn.cephasgm.com/app/](https://vpn.cephasgm.com/app/) |
| **Backend API** | `https://vpn.cephasgm.com/api/` |
| **Stripe webhook** | `https://vpn.cephasgm.com/webhook/stripe` |
| **WireGuard endpoint** | `13.53.36.150:51820` (UDP) |
| **Xray XTLS** | `vpn.cephasgm.com:8443` (TCP) |
| **Xray gRPC** | `vpn.cephasgm.com:8443` (type=grpc) |
| **Xray WebSocket** | `vpn.cephasgm.com:2053` (TCP) |

---

## 🔑 Important Keys & Secrets (Keep Safe)

| Item | Value |
|------|-------|
| **AWS VPS public IP** | `13.53.36.150` |
| **Domain** | `vpn.cephasgm.com` |
| **WireGuard private key** | `+ONKbJ/NspBSOsJuNxf1mf0ZgoqjrsXnA7lwKvrm6HI=` |
| **WireGuard public key** | `RQtFo7V0ChOIeFH0SFxuaPRHVqwoxEYynKTYwBcwY2w=` |
| **Xray UUID** | `71226db2-b1b8-4d94-9791-623b5c0c7851` |
| **JWT secret** | `u2W4J28b4aEvRTNh57JciVR3cyNfHeQiiaVDfwPjCDQ=` |
| **PostgreSQL** | `postgres` / `CephasGM1234` |
| **Stripe publishable key** | `pk_test_...` |
| **Stripe secret key** | `sk_test_...` |
| **Stripe webhook secret** | `whsec_...` |
| **Monthly price ID** | `price_1TIZIaRuPhAibWwjxU1eE4os` ($5.00) |
| **Yearly price ID** | `price_1TIZKiRuPhAibWwj40T744CB` ($45.00) |

> **Note:** The above Stripe keys are test mode keys. For production, replace with live keys.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Cloud** | AWS EC2 (Ubuntu 22.04, t2.micro) |
| **Reverse Proxy & SSL** | Nginx + Let’s Encrypt + Cloudflare |
| **VPN Tunnels** | WireGuard (UDP) + Xray (VLESS+XTLS, gRPC, WebSocket) |
| **Backend** | Node.js + Express + PostgreSQL |
| **Frontend** | Static HTML/CSS/JS + React PWA (Vite) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Billing** | Stripe Checkout + Webhooks |
| **Process Management** | PM2 |
| **DNS / CDN** | Cloudflare (proxied) |

---

## 🧪 Test Credentials

Use these accounts to test the service:

| Email | Password | Plan |
|-------|----------|------|
| `test@cephasgm.com` | `Test1234` | Premium (unlimited) |
| `admin@cephasgm.com` | `Test1234` | Premium (unlimited) |
| `cephasmkama@gmail.com` | `Test1234` | Premium (unlimited) |

You can also create a new free user via the signup page – free accounts are limited to **5 Mbps**.

---

## 💳 Stripe Test Card

Use this card in Stripe Checkout (test mode):

- **Card number:** `4242 4242 4242 4242`
- **Expiry:** any future date
- **CVC:** any three digits

After a successful payment, the user’s subscription status becomes `active` and the speed limit is removed.

---

## 📂 Project Structure (Final)
/home/ubuntu/CephasGM-VPN/
├── static/ # Phase 3 – HTML files
│ ├── index.html
│ ├── signup.html
│ ├── login.html
│ ├── trial.html
│ ├── subscription.html
│ ├── payment.html
│ └── dashboard.html
├── pwa/ # Phase 3 – Built React PWA
│ ├── index.html
│ ├── manifest.json
│ └── assets/
├── backend/ # Phases 1,3,4,5 – Node.js API
│ ├── .env
│ ├── package.json
│ ├── src/
│ │ ├── index.js
│ │ ├── config/db.js
│ │ ├── models/ (User.js, Server.js)
│ │ ├── services/
│ │ │ ├── wireguard.js
│ │ │ ├── stripe.js
│ │ │ └── xray.js
│ │ ├── middleware/ (auth.js, errorHandler.js)
│ │ ├── routes/ (auth.js, vpn.js)
│ │ └── utils/generate-client.sh
│ └── node_modules/
├── clients/ # Generated WireGuard client configs
└── (other scripts and configs)

/etc/nginx/sites-available/vpn # Nginx config (HTTPS, proxy, PWA)
/etc/letsencrypt/live/vpn.cephasgm.com/ # SSL certificates
/usr/local/etc/xray/config.json # Xray multi‑protocol config
/etc/wireguard/wg0.conf # WireGuard server config
/var/www/fake-blog/ # Fallback website (port 80)
/usr/local/bin/apply-bandwidth-limit.sh # Traffic control script


---

## 🚀 How to Use the VPN

### 1. WireGuard (Fast, UDP)
- Log in to the dashboard.
- Click **“Generate WireGuard Config”**.
- Download the `.conf` file.
- Import into any WireGuard client (Windows, macOS, Linux, Android, iOS).
- Activate the tunnel.

### 2. Xray VLESS+XTLS (Anti‑Censorship, TCP 8443)
- On the dashboard, click **“Get Xray Config”**.
- Copy the VLESS link (starts with `vless://`).
- Import into an Xray‑compatible client (v2rayNG, Shadowrocket, v2rayN, Nekoray).
- Connect – traffic is obfuscated and bypasses DPI.

### 3. Xray gRPC & WebSocket (Alternative transports)
- The dashboard provides separate links for gRPC and WebSocket.
- Use them if XTLS is blocked in your network.

### 4. React PWA (Installable App)
- Visit `https://vpn.cephasgm.com/app/` on a mobile or desktop browser.
- Use the “Install” prompt (Chrome/Edge) or “Add to Home Screen” (Safari).
- The PWA works offline and looks like a native app.

---

## 🛡️ Security & Anti‑Censorship Features

- **Cloudflare proxy** hides the origin IP (`13.53.36.150`) behind Cloudflare’s IP range.
- **Xray VLESS+XTLS** mimics normal HTTPS traffic, defeating Deep Packet Inspection.
- **Random packet padding** and **gRPC/WebSocket transports** add extra obfuscation.
- **JWT authentication** secures all API endpoints.
- **WireGuard** provides a fast, modern VPN tunnel with strong crypto.

---

## 📊 Monitoring & Maintenance

- **Backend logs:** `pm2 logs vpn-backend`
- **WireGuard status:** `sudo wg show`
- **Xray status:** `sudo systemctl status xray`
- **Nginx logs:** `sudo tail -f /var/log/nginx/error.log`
- **PostgreSQL:** `sudo -u postgres psql -d vpn_db`

All services are configured to **auto‑start** on boot (PM2, systemd).

---

## 🔧 Troubleshooting Common Issues

| Problem | Solution |
|---------|----------|
| **502 Bad Gateway** | Backend not running → `pm2 restart vpn-backend` |
| **WireGuard handshake fails** | Ensure UDP 51820 is open in AWS security group |
| **Xray connection fails** | Check Xray is running: `sudo systemctl restart xray` |
| **Stripe webhook not received** | Verify webhook URL in Stripe dashboard and secret key |
| **Free tier speed limit not applied** | Run `sudo /usr/local/bin/apply-bandwidth-limit.sh <clientIP> 5` manually |

---

## 📚 Full Documentation

For detailed implementation steps (commands, configs, and explanations), refer to the GitHub repository and the companion guide that covers:

- **Phase 1:** AWS setup, WireGuard, Node.js backend, PostgreSQL
- **Phase 2:** Domain, SSL, Xray VLESS+XTLS
- **Phase 3:** React PWA, auto peer addition
- **Phase 4:** Xray on port 443, fallback website
- **Phase 5:** Cloudflare fronting, Stripe billing, free tier, multiple Xray protocols

---

## 👨‍💻 Author

Developed by **CephasGM**  
- GitHub: [@cephasgm](https://github.com/cephasgm)  
- Live site: [https://vpn.cephasgm.com](https://vpn.cephasgm.com)  
- Project repository: [https://github.com/cephasgm/CephasGM-VPN](https://github.com/cephasgm/CephasGM-VPN)

---

## 📝 License

This project is for educational and personal use. Please comply with all applicable laws when using VPN technology.

---

**Congratulations!** Your VPN platform is fully functional, anti‑censorship, and ready for production. 🎉
