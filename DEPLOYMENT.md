# Family Tree App - Deployment Guide

This guide provides multiple deployment options that avoid SWC (Speedy Web Compiler) issues.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Import the project** - Vercel will automatically detect Next.js
3. **Deploy** - The `vercel.json` configuration will handle SWC issues
4. **Environment Variables** (if needed):
   - Add any required environment variables in Vercel dashboard

### Option 2: Netlify
1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Deploy** - Netlify will use the Next.js configuration

### Option 3: Railway
1. **Connect your repository** to Railway
2. **Automatic deployment** - Railway detects Next.js automatically
3. **Environment Variables** - Add in Railway dashboard

### Option 4: Docker Deployment
```bash
# Build the Docker image
docker build -t family-tree-app .

# Run the container
docker run -p 3000:3000 family-tree-app
```

## 🔧 Manual Server Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Steps
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd family-tree-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

## 🌐 Environment Variables

Create a `.env.local` file for local development:
```env
# Database
DATABASE_URL=file:./family-tree.db

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Build Configuration

The app is configured to avoid SWC issues:

- **SWC disabled** in `next.config.js`
- **Babel configuration** in `.babelrc`
- **Standalone output** for better server compatibility
- **Webpack fallbacks** for Node.js modules

## 🐳 Docker Compose (Optional)

Create a `docker-compose.yml` for easy deployment:

```yaml
version: '3.8'
services:
  family-tree-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
```

## 🔍 Troubleshooting

### Common Issues

1. **SWC Compilation Errors**:
   - The app is configured to use Babel instead of SWC
   - Check that `next.config.js` has `swcMinify: false`

2. **Database Issues**:
   - Ensure the database file is writable
   - Check file permissions on the server

3. **Build Failures**:
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

4. **Port Issues**:
   - Check if port 3000 is available
   - Use `PORT=3001 npm start` to change port

### Performance Optimization

1. **Enable compression** on your server
2. **Use a CDN** for static assets
3. **Configure caching** headers
4. **Monitor memory usage** - the app uses SQLite which is memory-efficient

## 📊 Monitoring

- **Health check endpoint**: `/api/health`
- **Database status**: Check SQLite file size and permissions
- **Memory usage**: Monitor Node.js process memory

## 🔒 Security

- **HTTPS**: Always use HTTPS in production
- **Headers**: Security headers are configured in `next.config.js`
- **Environment variables**: Never commit sensitive data
- **Database**: SQLite file should be in a secure location

## 📈 Scaling

For high-traffic deployments:

1. **Use a reverse proxy** (nginx, Apache)
2. **Implement caching** (Redis, Memcached)
3. **Consider database migration** to PostgreSQL/MySQL
4. **Load balancing** for multiple instances

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Review server logs
3. Verify environment variables
4. Test with a fresh build

---

**Note**: This app is optimized for deployment without SWC to avoid compilation issues on various hosting platforms. 