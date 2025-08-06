# How to Troubleshoot Issues

This guide covers common problems and their solutions for the SP2025 CMS system.

## 🐛 Troubleshooting

### **Common Issues and Solutions**

#### **CORS Errors**

**Problem:** Browser shows CORS errors when making requests

**Solution:**

```bash
# In Strapi config/middlewares.ts
module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:3001']
    }
  }
}
```

**NestJS CORS Configuration:**

```typescript
// server/src/main.ts
app.enableCors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
});
```

#### **Database Connection Issues**

**Problem:** Strapi can't connect to PostgreSQL

**Diagnosis:**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check database connection using pgAdmin
# 1. Open pgAdmin in your browser
# 2. Connect to PostgreSQL server (localhost:5432)
# 3. Expand Servers → PostgreSQL → Databases
# 4. Check if 'strapi' database exists in the list
```

**Solutions:**

1. **Start PostgreSQL:**

   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database:**

   ```sql
   -- Using pgAdmin to create database
   -- 1. Open pgAdmin and connect to PostgreSQL
   -- 2. Right-click on 'PostgreSQL' → Create → Database
   -- 3. Name it 'strapi' and click Save
   -- 4. No additional user creation needed
   ```

3. **Check Environment Variables:**

   ```bash
   # Verify cms/.env file exists and has correct values
   cat cms/.env | grep DATABASE
   ```

#### **Authentication Failures**

**Problem:** JWT tokens not working or authentication failing

**Diagnosis:**

```bash
# Check JWT secret in server .env
cat server/.env | grep JWT_SECRET

# Verify API token in Strapi
# Go to http://localhost:1337/admin → Settings → API Tokens
```

**Solutions:**

1. **Generate New JWT Secret:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

1. **Create New API Token:**

   - Go to Strapi Admin: `http://localhost:1337/admin`
   - Navigate to Settings → API Tokens
   - Create new token with "Full access" type
   - Update `server/.env` with new token

1. **Check Token Expiration:**

   ```javascript
   // Client-side token validation
   const token = localStorage.getItem("jwt");
   if (token) {
     const payload = JSON.parse(atob(token.split(".")[1]));
     if (payload.exp * 1000 < Date.now()) {
       localStorage.removeItem("jwt");
       // Redirect to login
     }
   }
   ```

#### **Port Conflicts**

**Problem:** Services won't start due to port already in use

**Diagnosis:**

```bash
# Check what's using the ports
lsof -i :1337  # Strapi port
lsof -i :3000  # NestJS port
lsof -i :5432  # PostgreSQL port
```

**Solutions:**

1. **Kill Process Using Port:**

   ```bash
   # Find process ID
   lsof -i :1337

   # Kill process
   kill -9 <PID>
   ```

1. **Change Ports:**

   **Strapi Port:**

   ```typescript
   // cms/config/server.ts
   export default ({ env }) => ({
     host: env("HOST", "0.0.0.0"),
     port: env.int("PORT", 1338), // Change to 1338
   });
   ```

   **NestJS Port:**

   ```typescript
   // server/src/main.ts
   const port = process.env.PORT || 3001; // Change to 3001
   await app.listen(port);
   ```

#### **Environment Variable Issues**

**Problem:** Services not starting due to missing environment variables

**Diagnosis:**

```bash
# Check if .env files exist
ls -la cms/.env
ls -la server/.env

# Verify environment variables are loaded
cd cms && node -e "console.log(process.env.DATABASE_HOST)"
cd ../server && node -e "console.log(process.env.STRAPI_URL)"
```

**Solutions:**

1. **Create Missing .env Files:**

   ```bash
   # Copy example files
   cp cms/.env.example cms/.env
   cp server/.env.example server/.env
   ```

1. **Set Required Variables:**

   ```env
   # cms/.env
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=strapi
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_SSL=false
   ```

   ```env
   # server/.env
   STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your-api-token
   JWT_SECRET=your-jwt-secret
   ```

#### **Node.js Version Issues**

**Problem:** Incompatible Node.js version

**Diagnosis:**

```bash
node --version
# Should be 18+ for this project
```

**Solutions:**

1. **Install Node Version Manager (nvm):**

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   ```

1. **Install Correct Node Version:**

   ```bash
   nvm install 18
   nvm use 18
   nvm alias default 18
   ```

#### **Package Installation Issues**

**Problem:** Dependencies not installing correctly

**Solutions:**

1. **Clear Cache and Reinstall:**

   ```bash
   # Clear pnpm cache
   pnpm store prune

   # Remove node_modules and reinstall
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

1. **Check pnpm Installation:**

   ```bash
   # Reinstall pnpm globally
   curl -fsSL https://get.pnpm.io/install.sh | sh -

   # Or use curl method
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   ```

## 🔧 Debug Mode

### **Strapi Debug**

```bash
cd cms
DEBUG=strapi:* pnpm develop
```

**Common Debug Flags:**

- `DEBUG=strapi:*` - All Strapi logs
- `DEBUG=strapi:database:*` - Database operations
- `DEBUG=strapi:api:*` - API requests
- `DEBUG=strapi:auth:*` - Authentication logs

### **NestJS Debug**

```bash
cd server
DEBUG=* pnpm start:dev
```

**Enable Detailed Logging:**

```typescript
// server/src/main.ts
import { Logger } from "@nestjs/common";

const logger = new Logger("Bootstrap");
logger.log("Application starting...");
```

### **Client Debug**

**Browser Developer Tools:**

- **F12** or **Right-click → Inspect**
- **Console** tab: JavaScript errors and logs
- **Network** tab: HTTP requests and responses
- **Application** tab: Local storage and cookies

**Enable Client Logging:**

```javascript
// client/script.js
console.log("Loading articles...");
console.error("Error:", error);
```

## 📊 Health Check Commands

### **Quick Health Check Script**

```bash
#!/bin/bash
echo "=== SP2025 CMS Health Check ==="

# Check PostgreSQL
echo "PostgreSQL:"
if pg_isready -h localhost -p 5432 > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

# Check Strapi
echo "Strapi CMS:"
if curl -s http://localhost:1337/api/articles > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

# Check NestJS
echo "NestJS Server:"
if curl -s http://localhost:3000/api/articles > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

# Check ports
echo "Port Status:"
netstat -tulpn | grep -E "(1337|3000|5432)" || echo "No services found on expected ports"
```

### **Service Status Commands**

```bash
# Check all Node.js processes
ps aux | grep -E "(strapi|nest|node)"

# Check specific ports
netstat -tulpn | grep -E "(1337|3000|5432)"

# Check service logs
tail -f cms/.tmp/logs/*.log
tail -f server/logs/*.log

# Check database connections using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Query Tool
# 3. Run: SELECT version();
```

## 🚨 Emergency Procedures

### **Complete System Reset**

If the system becomes completely unresponsive:

```bash
# Kill all Node.js processes
pkill -f node

# Restart PostgreSQL
sudo systemctl restart postgresql

# Clear temporary files
rm -rf cms/.tmp
rm -rf server/dist

# Restart services in order
cd cms && pnpm develop &
cd ../server && pnpm start:dev &
```

### **Database Reset**

**Warning:** This will delete all data!

```bash
# Drop and recreate database using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Delete/Drop
# 3. Right-click on 'PostgreSQL' → Create → Database
# 4. Name it 'strapi' and click Save

# Restart Strapi to recreate tables
cd cms && pnpm develop
```

### **Environment Reset**

```bash
# Remove all .env files
rm cms/.env
rm server/.env

# Remove node_modules
rm -rf cms/node_modules
rm -rf server/node_modules

# Reinstall everything
cd cms && pnpm install
cd ../server && pnpm install

# Recreate .env files from examples
cp cms/.env.example cms/.env
cp server/.env.example server/.env
```

## 🔍 Advanced Debugging

### **Network Debugging**

**Check API Endpoints:**

```bash
# Test Strapi API
curl -v http://localhost:1337/api/articles

# Test NestJS API
curl -v http://localhost:3000/api/articles

# Test with authentication
curl -v -H "Authorization: Bearer <jwt>" http://localhost:3000/api/articles
```

**Check CORS Headers:**

```bash
curl -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:3000/api/articles
```

### **Database Debugging**

**Check Database Schema:**

```sql
-- Connect to database using pgAdmin
-- 1. Open pgAdmin and connect to PostgreSQL
-- 2. Right-click on 'strapi' database → Query Tool
-- 3. Run the following queries:

-- List all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check articles table structure
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'articles';

-- Check for data
SELECT COUNT(*) FROM articles;
SELECT * FROM articles LIMIT 5;
```

**Check Database Logs:**

```bash
# Enable PostgreSQL query logging using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'PostgreSQL' → Query Tool
# 3. Run: ALTER SYSTEM SET log_statement = 'all';
# 4. Run: SELECT pg_reload_conf();

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### **Performance Debugging**

**Check Memory Usage:**

```bash
# Check Node.js memory usage
ps aux | grep node

# Check database connections using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Query Tool
# 3. Run: SELECT * FROM pg_stat_activity;
```

**Check Response Times:**

```bash
# Time API requests
time curl http://localhost:3000/api/articles

# Check with verbose output
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/articles
```

## 📝 Common Error Messages

### **Strapi Errors**

#### Database connection failed

- Check PostgreSQL is running
- Verify database credentials
- Check network connectivity

#### API token invalid

- Regenerate API token in Strapi admin
- Update environment variables
- Check token permissions

#### Content type not found

- Check content type exists in Strapi
- Verify API permissions
- Restart Strapi after schema changes

### **NestJS Errors**

#### Cannot resolve dependencies

- Check module imports
- Verify service providers
- Restart development server

#### Validation failed

- Check DTO validation rules
- Verify request data format
- Check required fields

#### JWT expired

- Generate new JWT token
- Check token expiration settings
- Implement token refresh logic

### **Client Errors**

#### CORS policy

- Check CORS configuration
- Verify allowed origins
- Check request headers

#### Network error

- Check server is running
- Verify API endpoints
- Check network connectivity

#### Authentication failed

- Check JWT token validity
- Verify authentication headers
- Check token expiration

## 📞 Getting Help

### **Before Asking for Help**

1. **Check the logs:**

   - Strapi logs in terminal
   - NestJS logs in terminal
   - Browser console logs

1. **Verify basic setup:**

   - All services are running
   - Environment variables are set
   - Database is accessible

1. **Try common solutions:**
   - Restart services
   - Clear cache
   - Check port conflicts

### **Providing Information**

When asking for help, include:

1. **Error messages** (exact text)
1. **Steps to reproduce** the issue
1. **Environment details:**
   - Operating system
   - Node.js version
   - Database version
1. **Relevant logs** from services
1. **What you've already tried**

### **Useful Commands for Debugging**

```bash
# System information
node --version
pnpm --version
# PostgreSQL version can be checked in pgAdmin: Help → About

# Service status
sudo systemctl status postgresql
ps aux | grep -E "(strapi|nest)"

# Network connectivity
curl -I http://localhost:1337
curl -I http://localhost:3000

# Database connectivity using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Query Tool
# 3. Run: SELECT 1;
```

## 📝 Next Steps

After resolving issues:

1. [Learn how to use the application](./how-to-use.md)
1. [Explore adding new features](./how-to-add-features.md)
1. [Check deployment options](./how-to-expand.md)

---

**Still having issues?** Check the [learning resources](./learning-resources.md) for additional help and documentation.
