# Family Tree App - Deployment Guide

This guide provides multiple deployment options that avoid SWC (Speedy Web Compiler) issues and use PlanetScale as the serverless database.

## 🗄️ Database Setup (PlanetScale)

### Step 1: Create PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up for a free account
3. Create a new database

### Step 2: Get Database Credentials
1. In your PlanetScale dashboard, go to your database
2. Click "Connect" → "Connect with Prisma"
3. Copy the connection details:
   - Host: `aws.connect.psdb.cloud`
   - Username: `your_username`
   - Password: `your_password`
   - Database: `your_database_name`

### Step 3: Set Environment Variables
Create a `.env.local` file:
```env
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Database Migrations
```bash
# Generate migration
npm run db:generate

# Apply migration to PlanetScale
npm run db:migrate
```

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Import the project** - Vercel will automatically detect Next.js
3. **Add Environment Variables** in Vercel dashboard:
   - `DATABASE_HOST`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `DATABASE_NAME`
4. **Deploy** - The `vercel.json` configuration will handle SWC issues

### Option 2: Netlify
1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Add Environment Variables** in Netlify dashboard
4. **Deploy** - Netlify will use the Next.js configuration

### Option 3: Railway
1. **Connect your repository** to Railway
2. **Add Environment Variables** in Railway dashboard
3. **Automatic deployment** - Railway detects Next.js automatically

### Option 4: Docker Deployment
```bash
# Build the Docker image
docker build -t family-tree-app .

# Run the container with environment variables
docker run -p 3000:3000 \
  -e DATABASE_HOST=your_host \
  -e DATABASE_USERNAME=your_username \
  -e DATABASE_PASSWORD=your_password \
  -e DATABASE_NAME=your_database \
  family-tree-app
```

## 🔧 Manual Server Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- PlanetScale database

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

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your PlanetScale credentials
   ```

4. **Run database migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Build the application**:
   ```bash
   npm run build
   ```

6. **Start the production server**:
   ```bash
   npm start
   ```

## 📦 Build Configuration

The app is configured to avoid SWC issues:

- **SWC disabled** in `next.config.js`
- **Babel configuration** in `.babelrc`
- **Standalone output** for better server compatibility
- **Webpack fallbacks** for Node.js modules
- **PlanetScale MySQL** for serverless database

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
      - DATABASE_HOST=${DATABASE_HOST}
      - DATABASE_USERNAME=${DATABASE_USERNAME}
      - DATABASE_PASSWORD=${DATABASE_PASSWORD}
      - DATABASE_NAME=${DATABASE_NAME}
    env_file:
      - .env.local
```

## 🔍 Troubleshooting

### Common Issues

1. **SWC Compilation Errors**:
   - The app is configured to use Babel instead of SWC
   - Check that `next.config.js` has `swcMinify: false`

2. **Database Connection Issues**:
   - Verify PlanetScale credentials in environment variables
   - Check if database exists and is accessible
   - Ensure migrations have been run

3. **Build Failures**:
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check environment variables are set correctly

4. **Port Issues**:
   - Check if port 3000 is available
   - Use `PORT=3001 npm start` to change port

### Database Issues

1. **Migration Failures**:
   ```bash
   # Reset migrations
   npm run db:drop
   npm run db:generate
   npm run db:migrate
   ```

2. **Connection Timeouts**:
   - Check PlanetScale dashboard for connection limits
   - Verify network connectivity
   - Check if database is in maintenance mode

### Performance Optimization

1. **Enable compression** on your server
2. **Use a CDN** for static assets
3. **Configure caching** headers
4. **Monitor database connections** - PlanetScale has connection limits

## 📊 Monitoring

- **Health check endpoint**: `/api/health`
- **Database status**: Check PlanetScale dashboard
- **Connection usage**: Monitor in PlanetScale dashboard
- **Memory usage**: Monitor Node.js process memory

## 🔒 Security

- **HTTPS**: Always use HTTPS in production
- **Headers**: Security headers are configured in `next.config.js`
- **Environment variables**: Never commit sensitive data
- **Database**: Use PlanetScale's built-in security features
- **Connection strings**: Keep database credentials secure

## 📈 Scaling

For high-traffic deployments:

1. **Use a reverse proxy** (nginx, Apache)
2. **Implement caching** (Redis, Memcached)
3. **Upgrade PlanetScale plan** for more connections
4. **Load balancing** for multiple instances

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Review server logs
3. Verify environment variables
4. Check PlanetScale dashboard for database issues
5. Test with a fresh build

---

**Note**: This app is optimized for deployment without SWC and uses PlanetScale for serverless database functionality. 