# How to Configure Environment

This guide covers all configuration aspects including environment variables, database setup, and service configuration.

## ⚙️ Environment Variables Setup

### **Strapi CMS Configuration**

1. **Create Environment File:**

```bash
cd cms
cp .env.example .env
```

1. **Configure Database Settings:**

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Application Settings
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

1. **Generate Secure Keys:**

```bash
# Generate random keys for security
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **NestJS Server Configuration**

1. **Create Environment File:**

```bash
cd server
cp .env.example .env
```

1. **Configure Server Settings:**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Strapi Integration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Database (if using direct database access)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

## 🗄️ Database Configuration

### **PostgreSQL Setup**

1. Install PostgreSQL:

#### macOS

```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

##### Create Database and User

```sql
-- Using pgAdmin to create database
-- 1. Open pgAdmin and connect to PostgreSQL
-- 2. Right-click on 'PostgreSQL' → Create → Database
-- 3. Name it 'strapi' and click Save
```

### Database Configuration Files

#### Strapi Database Config (`cms/config/database.ts`)

```typescript
export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "strapi"),
      user: env("DATABASE_USERNAME", "postgres"),
      password: env("DATABASE_PASSWORD", "postgres"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
```

#### NestJS Database Config (if using direct database access)

```typescript
// server/src/config/database.config.ts
export const databaseConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || "strapi",
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
};
```

## 🔐 Security Configuration

### API Token Setup

1. Create Strapi API Token:

- Go to Strapi Admin Panel: `http://localhost:1337/admin`
- Navigate to Settings → API Tokens
- Click "Create new API Token"
- Set name: "NestJS Integration"
- Set description: "Token for NestJS server integration"
- Set token duration: "Unlimited"
- Set token type: "Full access"
- Copy the generated token

1. **Configure NestJS with API Token:**

```env
# In server/.env
STRAPI_API_TOKEN=your-generated-token-here
```

### JWT Configuration

1. Generate JWT Secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

1. Configure JWT in NestJS:

```typescript
// server/src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
}
```

## 🌐 CORS Configuration

### Strapi CORS Settings

```typescript
// cms/config/middlewares.ts
export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "media-src": ["'self'", "data:", "blob:", "https:"],
          upgradeInsecureRequests: null,
        },
      },
      frameguard: false,
    },
  },
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
```

### **NestJS CORS Settings**

```typescript
// server/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  });

  await app.listen(3000);
}
```

## 🔧 Service Configuration

### **Strapi Server Config**

```typescript
// cms/config/server.ts
export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
```

### **NestJS Server Config**

```typescript
// server/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix("api");

  // CORS
  app.enableCors({
    origin: ["http://localhost:3001"],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("SP2025 CMS API")
    .setDescription("API documentation for SP2025 CMS")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
```

## ✅ Configuration Verification

### **Test Database Connection**

```bash
# Test PostgreSQL connection using pgAdmin
# 1. Open pgAdmin in your browser
# 2. Connect to PostgreSQL server (localhost:5432)
# 3. Right-click on 'strapi' database → Query Tool
# 4. Run: SELECT version();
```

### **Test Strapi Configuration**

```bash
cd cms
pnpm strapi config:info
```

### **Test NestJS Configuration**

```bash
cd server
pnpm start:dev
# Check if server starts without errors
```

## 🚨 Common Configuration Issues

### **Environment Variable Issues**

```bash
# Check if .env files exist
ls -la cms/.env
ls -la server/.env

# Verify environment variables are loaded
cd cms && node -e "console.log(process.env.DATABASE_HOST)"
cd ../server && node -e "console.log(process.env.STRAPI_URL)"
```

### **CORS Issues**

If you encounter CORS errors:

1. Check that CORS origins match your client URL
1. Ensure credentials are properly configured
1. Verify that all services are running on correct ports

## 📝 Next Steps

After completing configuration:

1. [Start the applications](./how-to-start.md)
1. [Learn how to use the application](./how-to-use.md)
1. [Check the API reference](./api-reference.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
