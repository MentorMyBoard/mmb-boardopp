#!/bin/bash
# BoardOpp Lightsail Deployment Script
# Run this on the Lightsail server: bitnami@52.66.87.34
# SSH in first: ssh -i your-key.pem bitnami@52.66.87.34

set -e

echo "=== Step 1: Install Node.js 20.x ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v

echo "=== Step 2: Install PM2 globally ==="
sudo npm install -g pm2

echo "=== Step 3: Clone the repo ==="
cd /home/bitnami
git clone https://github.com/MentorMyBoard/mmb-boardopp.git boardopp
cd boardopp

echo "=== Step 4: Install frontend dependencies and build ==="
npm install
npm run build

echo "=== Step 5: Install backend dependencies ==="
cd server
npm install
cd ..

echo "=== Step 6: Create production .env ==="
# IMPORTANT: Run this block manually and fill in real values
cat > server/.env << 'ENVEOF'
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://boardopp.mentormyboard.com
DB_PATH=./boardopp.db
BREVO_API_KEY=your-brevo-api-key-here
SENDER_EMAIL=support@mentormyboard.com
SENDER_NAME=BoardOpp by MentorMyBoard
ADMIN_NOTIFICATION_EMAIL=info@mentormyboard.com
ADMIN_TOKEN=boardopp-admin-2024-secure
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_DATACENTER=in
ENVEOF
echo ".env created at server/.env"

echo "=== Step 7: Start backend with PM2 ==="
pm2 start server/index.js --name boardopp --cwd /home/bitnami/boardopp
pm2 save
pm2 startup systemd -u bitnami --hp /home/bitnami
# Run the output command from above as sudo

echo "=== Step 8: Test backend ==="
curl http://localhost:3001/api/health

echo "=== Step 9: Create Nginx server block ==="
sudo bash -c 'cat > /opt/bitnami/nginx/conf/server_blocks/boardopp.conf << "NGINXEOF"
server {
    listen 80;
    server_name boardopp.mentormyboard.com;

    root /home/bitnami/boardopp/dist;
    index index.html;

    # Serve static frontend files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Node.js backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF'

echo "=== Step 10: Test and reload Nginx ==="
sudo /opt/bitnami/nginx/sbin/nginx -t
sudo /opt/bitnami/ctlscript.sh restart nginx

echo "=== Step 11: Install Certbot and get SSL ==="
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d boardopp.mentormyboard.com --non-interactive --agree-tos --email info@mentormyboard.com

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Visit: https://boardopp.mentormyboard.com"
echo "Health: https://boardopp.mentormyboard.com/api/health"
echo "Admin:  https://boardopp.mentormyboard.com/admin"
