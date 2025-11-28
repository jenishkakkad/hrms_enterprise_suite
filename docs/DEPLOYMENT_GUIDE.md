# 🚀 HRMS SaaS Deployment Guide

## Overview
This guide covers deploying the HRMS SaaS platform to production environments including cloud providers, containerization, and CI/CD setup.

## 📋 Prerequisites

### System Requirements
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v5.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 20GB SSD
- **Network**: HTTPS certificate required

### Required Services
- **Database**: MongoDB Atlas or self-hosted MongoDB
- **Email**: SMTP service (Gmail, SendGrid, etc.)
- **Storage**: AWS S3 or compatible object storage
- **Payment**: Stripe and/or Razorpay accounts
- **Monitoring**: Optional (New Relic, DataDog, etc.)

---

## 🌐 Cloud Deployment Options

### 1. AWS Deployment

#### EC2 + RDS Setup
```bash
# Launch EC2 instance (t3.medium recommended)
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup application
git clone <repository-url>
cd HRMS
```

#### Environment Configuration
```bash
# Backend environment
cd backend
cp .env.example .env
nano .env
```

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_prod
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
FRONTEND_URL=https://yourdomain.com

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=hrms-uploads

# Email Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_your_stripe_key
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### Build and Start
```bash
# Install dependencies
npm install --production

# Start with PM2
pm2 start src/server.js --name "hrms-backend"
pm2 startup
pm2 save
```

#### Frontend Deployment
```bash
cd ../frontend
npm install
npm run build

# Serve with nginx or deploy to S3 + CloudFront
```

### 2. Digital Ocean Deployment

#### Droplet Setup
```bash
# Create Ubuntu 20.04 droplet (2GB RAM minimum)
# SSH into droplet
ssh root@your_droplet_ip

# Install dependencies
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs nginx certbot python3-certbot-nginx
npm install -g pm2
```

#### MongoDB Setup
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod
```

### 3. Heroku Deployment

#### Heroku Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create hrms-saas-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=https://hrms-saas-app.herokuapp.com
```

#### Procfile
```
web: node backend/src/server.js
```

#### Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## 🐳 Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["node", "src/server.js"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: hrms-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    container_name: hrms-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/hrms_prod?authSource=admin
      JWT_SECRET: your_jwt_secret
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./frontend
    container_name: hrms-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    container_name: hrms-nginx
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

---

## 🔧 Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;
        }

        # File uploads
        location /uploads/ {
            alias /var/www/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 🔐 SSL Certificate Setup

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Custom SSL Certificate
```bash
# Copy certificate files
sudo cp your-cert.crt /etc/nginx/ssl/cert.pem
sudo cp your-private-key.key /etc/nginx/ssl/key.pem
sudo chmod 600 /etc/nginx/ssl/*
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/hrms
            git pull origin main
            cd backend && npm ci --production
            cd ../frontend && npm ci && npm run build
            pm2 restart hrms-backend
            sudo systemctl reload nginx
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - cd backend && npm ci && npm test
    - cd ../frontend && npm ci && npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t hrms-backend ./backend
    - docker build -t hrms-frontend ./frontend
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - ssh user@server "docker pull $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA"
    - ssh user@server "docker pull $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA"
    - ssh user@server "docker-compose up -d"
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View logs
pm2 logs hrms-backend

# Monitor resources
pm2 monit
```

### Application Monitoring
```javascript
// backend/src/config/monitoring.js
const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'hrms-api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

module.exports = logger;
```

### Health Check Endpoint
```javascript
// backend/src/routes/health.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

---

## 🔄 Database Migration & Backup

### MongoDB Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://username:password@host:port/database" --out="/backups/hrms_$DATE"
tar -czf "/backups/hrms_$DATE.tar.gz" "/backups/hrms_$DATE"
rm -rf "/backups/hrms_$DATE"

# Schedule with cron
0 2 * * * /path/to/backup-script.sh
```

### Database Migration
```javascript
// backend/src/migrations/001_add_indexes.js
const mongoose = require('mongoose');

module.exports = {
  async up() {
    await mongoose.connection.db.collection('employees').createIndex({ tenant_id: 1, employee_id: 1 }, { unique: true });
    await mongoose.connection.db.collection('attendance_logs').createIndex({ tenant_id: 1, employee_id: 1, date: -1 });
  },

  async down() {
    await mongoose.connection.db.collection('employees').dropIndex({ tenant_id: 1, employee_id: 1 });
    await mongoose.connection.db.collection('attendance_logs').dropIndex({ tenant_id: 1, employee_id: 1, date: -1 });
  }
};
```

---

## 🔧 Performance Optimization

### Backend Optimization
```javascript
// Enable compression
app.use(compression());

// Cache static files
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));

// Database connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Frontend Optimization
```javascript
// Code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Service worker for caching
// public/sw.js
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

## 🚨 Security Checklist

### Production Security
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] File upload restrictions
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Backup encryption enabled

### Security Headers
```javascript
// backend/src/middleware/security.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 📞 Support & Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
mongo "mongodb://username:password@host:port/database"
```

#### 2. PM2 Process Crashed
```bash
# Restart process
pm2 restart hrms-backend

# Check logs
pm2 logs hrms-backend --lines 100
```

#### 3. High Memory Usage
```bash
# Monitor memory
pm2 monit

# Restart if needed
pm2 restart hrms-backend
```

### Log Analysis
```bash
# View error logs
tail -f logs/error.log

# Search for specific errors
grep "ERROR" logs/combined.log | tail -20
```

### Performance Monitoring
```bash
# Check server resources
htop
df -h
free -m

# Monitor network
netstat -tulpn | grep :5000
```

---

## 📋 Post-Deployment Checklist

- [ ] Application starts successfully
- [ ] Database connection working
- [ ] SSL certificate valid
- [ ] All API endpoints responding
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Payment gateway integration working
- [ ] Monitoring and logging configured
- [ ] Backup system operational
- [ ] Security measures in place
- [ ] Performance optimization applied
- [ ] CI/CD pipeline configured

---

## 📞 Support

For deployment support:
- Email: devops@hrmssaas.com
- Slack: #deployment-support
- Documentation: https://docs.hrmssaas.com