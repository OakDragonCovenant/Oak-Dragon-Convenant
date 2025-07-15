# 🏰 Oak Dragon Covenant - Landing Page Deployment Guide

## 🌟 Overview

This guide will help you deploy the Oak Dragon Covenant landing page with Matrix-style visuals, secure authentication, and professional branding.

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Git** for version control
- **SSL certificates** (for production)
- **Domain name** (optional)

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Development deployment
.\deploy-landing.ps1 -Development

# Production deployment
.\deploy-landing.ps1
```

### Linux/Mac (Bash)
```bash
# Make executable
chmod +x deploy-landing.sh

# Run deployment
./deploy-landing.sh
```

## 🔧 Manual Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with your configuration:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secure_jwt_secret_here
COINBASE_API_KEY=your_api_key
COINBASE_API_SECRET=your_api_secret
```

### 3. Start the Application
```bash
# Development
npm run dev

# Production
npm start

# With PM2 (recommended)
pm2 start server.js --name oak-dragon-covenant
```

## 🎯 Features

### ✨ Landing Page Features
- **Matrix-style animated background** in crimson, black, and gold
- **Secure user authentication** with JWT tokens
- **Rate limiting** and brute-force protection
- **Responsive design** for all devices
- **Real-time visual effects** and animations
- **Session management** with timeout warnings

### 🛡️ Security Features
- **Password hashing** with bcrypt
- **JWT token authentication**
- **Rate limiting** (5 attempts per 15 minutes)
- **Account lockout** after failed attempts
- **Secure headers** with Helmet.js
- **Input validation** and sanitization

### 🎨 Visual Features
- **Matrix rain effect** with falling code
- **Crimson, black, and gold color scheme**
- **Glowing interactive elements**
- **Particle effects** on successful login
- **Smooth animations** and transitions
- **Professional dragon-themed branding**

## 👤 Demo Credentials

| Username   | Password        | Role          |
|------------|----------------|---------------|
| `admin`    | `OakDragon2025!` | Administrator |
| `oakdragon`| `Covenant@2025` | User          |
| `strategist`| `Matrix$Gold`  | Strategist    |
| `demo`     | `demo123`      | Demo User     |

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token

### System
- `GET /` - Landing page
- `GET /api` - System status
- `GET /health` - Health check
- `GET /dashboard` - Main dashboard (authenticated)

## 🔒 Security Configuration

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Real-time strength indicator

### Rate Limiting
- Authentication: 5 attempts per 15 minutes
- API routes: 100 requests per 15 minutes
- Account lockout: 5 minutes after 3 failed attempts

### Session Management
- JWT tokens expire after 1 hour
- Automatic session timeout warnings
- Secure token storage in localStorage

## 🎛️ Customization

### Colors and Branding
Edit `/public/css/landing.css`:
```css
:root {
    --primary-crimson: #dc143c;
    --gold: #ffd700;
    --matrix-black: #0a0a0a;
    /* Customize other colors */
}
```

### Matrix Background
Modify `/public/js/matrix-background.js`:
```javascript
// Adjust animation speed
this.speed = 1.0; // Default: 1.0

// Change character set
this.characters = 'your_custom_characters';

// Modify color gradients
getColor(intensity) {
    // Your custom color logic
}
```

### Authentication Logic
Update `/routes/auth.js` for:
- Custom user validation
- Database integration
- External authentication providers

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure SSL certificates
3. Set up reverse proxy (nginx)
4. Configure monitoring
5. Set up automated backups

### SSL Configuration
Place certificates in `ssl/` directory:
- `ssl/fullchain.pem`
- `ssl/privkey.pem`

### Nginx Configuration
Use the provided `nginx/nginx.conf` for reverse proxy setup.

### Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name oak-dragon-covenant

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📊 Monitoring

### Health Checks
- Application: `GET /health`
- API Status: `GET /api`
- System metrics included in health response

### Logging
- Winston logger with structured logging
- Separate error and combined logs
- Configurable log levels

### Performance
- Request timing middleware
- Memory usage monitoring
- Automatic error reporting

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/Mac
```

**Module not found:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Authentication failures:**
- Check JWT_SECRET in environment
- Verify password hashes in auth.js
- Check rate limiting settings

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug node server.js

# Or set in .env file
LOG_LEVEL=debug
```

## 📝 Development

### File Structure
```
public/
├── landing.html          # Main landing page
├── css/landing.css       # Styles and animations
├── js/
│   ├── matrix-background.js # Matrix rain effect
│   ├── landing-auth.js      # Authentication logic
│   └── landing-effects.js   # UI effects and animations
routes/
└── auth.js              # Authentication routes
```

### Adding Features
1. **New animations**: Edit `landing-effects.js`
2. **API endpoints**: Add routes to `server.js`
3. **UI components**: Modify `landing.html` and `landing.css`
4. **Authentication**: Update `auth.js`

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Test with demo credentials
4. Check network connectivity and ports

---

**🏰 Oak Dragon Covenant** - Where financial intelligence meets cutting-edge technology.
