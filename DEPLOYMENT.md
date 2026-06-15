# BoardOpp Deployment Guide
## boardopp.mentormyboard.com on AWS Lightsail

---

## Local Development (Right Now)

Two terminals needed:

**Terminal 1 — Backend API server:**
```bash
cd server
npm install
node index.js
# Runs at: http://localhost:3001
```

**Terminal 2 — Frontend (Vite):**
```bash
npm run dev
# Runs at: http://localhost:5173
```

Open: **http://localhost:5173**

---

## DNS Records — GoDaddy (for boardopp.mentormyboard.com)

After getting your Lightsail Static IP, add this record in GoDaddy DNS:

| Type | Name       | Value                   | TTL  |
|------|------------|-------------------------|------|
| A    | boardopp   | [YOUR-LIGHTSAIL-IP]     | 600  |

**Steps in GoDaddy:**
1. Log in → My Products → DNS (for mentormyboard.com)
2. Add Record → Type: A
3. Name: `boardopp`
4. Value: `[Your Lightsail static IP]`
5. TTL: 600 (10 minutes)
6. Save

To allocate a Static IP on Lightsail:
- Lightsail Console → Networking → Create Static IP → Attach to your instance

---

## AWS Lightsail Setup

### 1. Create Instance
- Blueprint: **Node.js** (or Ubuntu 22.04 LTS)
- Plan: $10/month (2 GB RAM) recommended
- Attach a Static IP

### 2. Install Node.js (if Ubuntu)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PM2 (process manager)
```bash
sudo npm install -g pm2
```

### 4. Upload & Build
```bash
# On your machine — build the frontend
npm run build

# Upload the entire project to Lightsail (via SCP or git clone)
scp -r . user@[LIGHTSAIL-IP]:~/boardopp/

# On Lightsail server
cd ~/boardopp
npm install         # Frontend deps
cd server
npm install         # Backend deps
cd ..
```

### 5. Configure Environment
```bash
cd ~/boardopp/server
cp .env.example .env
nano .env
# Fill in:
#   NODE_ENV=production
#   FRONTEND_URL=https://boardopp.mentormyboard.com
#   PORT=3001
# (BREVO_API_KEY is already in .env from dev)
```

### 6. Start with PM2
```bash
cd ~/boardopp
NODE_ENV=production pm2 start server/index.js --name boardopp
pm2 save
pm2 startup  # Follow the printed command to auto-start on reboot
```

### 7. Nginx Reverse Proxy (recommended)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/boardopp
```

Paste:
```nginx
server {
    listen 80;
    server_name boardopp.mentormyboard.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/boardopp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL Certificate (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d boardopp.mentormyboard.com
# Follow prompts — auto-renews every 90 days
```

---

## Zoho CRM Setup (After Deployment)

Once you have the live domain:

1. Go to https://api-console.zoho.in
2. Create a "Server-based App"
3. Redirect URI: `https://boardopp.mentormyboard.com/zoho-callback`
4. Note **Client ID** and **Client Secret**
5. Generate Refresh Token (see `server/zoho.js` for exact OAuth URL)
6. Add to `server/.env`:
   ```
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ZOHO_REFRESH_TOKEN=your_refresh_token
   ZOHO_DATACENTER=in
   ```
7. Restart: `pm2 restart boardopp`

---

## Email Setup (Brevo)

The Brevo API key is already configured in `server/.env`.

**Required:** Verify your sender email in Brevo before going live:
1. Log in to Brevo → Senders & IPs → Add a Sender
2. Add: `noreply@mentormyboard.com`
3. Verify the domain by adding the TXT/DKIM records Brevo provides to GoDaddy DNS
4. Update `SENDER_EMAIL` in `server/.env` if using a different address

---

## Admin Panel

Access at: `https://boardopp.mentormyboard.com/admin`
Default password: `BoardOpp@2024`
**Change this immediately** via Admin → Content → Security tab.
