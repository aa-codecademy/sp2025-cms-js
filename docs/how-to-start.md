# How to Start the Applications

This guide covers how to start all applications in the correct order and verify they're running properly.

## 🏃‍♂️ Starting Applications (in order!)

### 1. Start Strapi CMS

```bash
cd cms
pnpm develop
```

**What happens:**

- Strapi starts on `http://localhost:1337`
- Admin panel available at `http://localhost:1337/admin`
- First time setup: Create admin user when prompted

**Expected output:**

```text
Welcome back!
To manage your project 🚀, go to the administration panel at:
http://localhost:1337/admin

To access the server ⚡️, go to:
http://localhost:1337
```

### 2. Start NestJS Server

```bash
cd ../server
pnpm start:dev
```

**What happens:**

- NestJS starts on `http://localhost:3000`
- API available at `http://localhost:3000/api`
- Swagger docs at `http://localhost:3000/api/docs`

**Expected output:**

```text
[Nest] 1234   - 12/07/2025, 10:00:00 AM   [NestApplication] Nest application successfully started +0ms
```

### 3. Start the Client

```bash
cd ../client
# Open index.html in your browser (no build step needed) / Or follow common framework docs if framework is used
```

**What happens:**

- Open `client/index.html` in your browser
- Client runs on `http://localhost:3001` (if using a local server)
- No build process required for plain JavaScript

## 🔍 Verification Steps

### **Check Strapi CMS**

1. **Visit Admin Panel:**

   - Go to `http://localhost:1337/admin`
   - Login with your admin credentials
   - Verify you can access the dashboard

2. **Create Content:**

   - Navigate to Content Manager → Articles
   - Create a test article
   - Set it to "Published" status

3. **Check API Endpoints:**

   - Visit `http://localhost:1337/api/articles`
   - Should return JSON response with your test article

4. **Verify Database Connection:**
   - Check Strapi logs for database connection messages
   - Should see "Database connection established" or similar

### **Check NestJS Server**

1. **Test API Health:**

   ```bash
   curl http://localhost:3000/api/articles
   ```

2. **Check Swagger Documentation:**

   - Visit `http://localhost:3000/api/docs`
   - Should show API documentation interface

3. **Verify Strapi Integration:**

   ```bash
   curl http://localhost:3000/api/articles
   # Should return articles from Strapi
   ```

### **Check Client Application**

1. **Load the Client:**

   - Open `http://localhost:3001` (or your client URL)
   - Should display the application interface

2. **Test Content Display:**

   - Verify articles are loading from the API
   - Check that content is displayed properly

3. **Test User Interaction Features (if any):**

   - Test contact forms, booking forms, etc.
   - Verify form submissions work correctly

## 🔧 Initial Setup

### **First Time Setup**

1. **Create Admin User in Strapi:**

   - Visit `http://localhost:1337/admin`
   - Follow the setup wizard
   - Create your admin account
   - Remember your credentials

2. **Create Initial Content:**

   - Go to Content Manager → Articles
   - Create a few test articles
   - Set them to "Published" status

3. **Configure Permissions:**

   - Go to Settings → Users & Permissions → Roles
   - Edit "Public" role
   - Allow "find" and "findOne" for Articles
   - Save changes

### **Environment Variables**

Verify these environment variables are set:

```bash
# Check Strapi environment
cd cms
node -e "console.log('STRAPI_URL:', process.env.STRAPI_URL)"

# Check NestJS environment
cd ../server
node -e "console.log('STRAPI_URL:', process.env.STRAPI_URL)"
```

## 🚨 Common Startup Issues

### **Strapi Issues**

**Database Connection Failed:**

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Expand Servers → PostgreSQL → Databases
# 3. Check if 'strapi' database exists in the list
```

**Port Already in Use:**

```bash
# Check what's using port 1337
lsof -i :1337

# Kill the process if needed
kill -9 <PID>
```

### **NestJS Issues**

**Strapi Connection Failed:**

- Check Strapi is running on port 1337
- Verify `STRAPI_URL` environment variable
- Check `STRAPI_API_TOKEN` is set correctly

**Port Already in Use:**

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### **Client Issues**

**CORS Errors:**

- Check NestJS CORS configuration
- Verify client URL is in allowed origins
- Check browser console for errors

**API Connection Failed:**

- Verify NestJS server is running
- Check API endpoint URLs
- Test with curl to isolate issues

## 📊 Monitoring Applications

### **Strapi Monitoring**

```bash
# Check Strapi logs
cd cms
tail -f .tmp/logs/strapi.log

# Monitor memory usage
ps aux | grep strapi
```

### **NestJS Monitoring**

```bash
# Check NestJS logs
cd server
tail -f logs/app.log

# Monitor memory usage
ps aux | grep node
```

### **Database Monitoring**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Monitor database connections using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Query Tool
# 3. Run: SELECT * FROM pg_stat_activity;
```

## 🔄 Restarting Applications

### **Development Restart**

```bash
# Stop all applications (Ctrl+C in each terminal)
# Then restart in order:

# 1. Strapi
cd cms && pnpm develop

# 2. NestJS
cd ../server && pnpm start:dev

# 3. Client
# Open in browser
```

### **Production Restart**

```bash
# Stop services
sudo systemctl stop strapi
sudo systemctl stop nestjs

# Start services
sudo systemctl start strapi
sudo systemctl start nestjs
```

## 📝 Next Steps

After successfully starting all applications:

1. [Learn how to use the application](./how-to-use.md)
2. [Check the API reference](./api-reference.md)
3. [Explore adding new features](./how-to-add-features.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
