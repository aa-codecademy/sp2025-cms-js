# How to Install and Setup

This guide covers the complete installation and setup process for the SP2025 CMS Fullstack Boilerplate.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (install globally: `curl -fsSL https://get.pnpm.io/install.sh | sh -`)
- [PostgreSQL](https://www.postgresql.org/) (v12+ recommended)

### **Why These Versions?**

- **Node.js 18+**: Required for modern ES modules and better performance
- **pnpm**: Faster, more efficient package manager with better dependency resolution
- **PostgreSQL**: Strapi's recommended database for production use

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone <your-repo-url> sp2025-cms
cd sp2025-cms
```

### 2. Install Dependencies (in order!)

#### 2.1. Strapi CMS

```bash
cd cms
pnpm install
```

#### 2.2. NestJS Server

```bash
cd ../server
pnpm install
```

#### 2.3. Client (optional, for static assets)

```bash
cd ../client
# No dependencies for plain JS, but you can add your own if needed
```

## 🗄️ Database Setup

### **PostgreSQL Installation**

#### macOS (using Homebrew)

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

#### Windows

Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### **Database Configuration**

1. **Create Database:**

```sql
-- Using pgAdmin to create database
-- 1. Open pgAdmin and connect to PostgreSQL
-- 2. Right-click on 'PostgreSQL' → Create → Database
-- 3. Name it 'strapi' and click Save
```

1. **Environment Variables:**
   Set the following environment variables in `cms/.env`:

- `DATABASE_CLIENT=postgres`
- `DATABASE_HOST=localhost` (or your DB host)
- `DATABASE_PORT=5432` (default Postgres port)
- `DATABASE_NAME=strapi` (your database name, use the project name)
- `DATABASE_USERNAME=postgres` (default postgres user)
- `DATABASE_PASSWORD=postgres` (default postgres password)
- `DATABASE_SSL=false` (locally should be false, set to true if using SSL on prod)

Example `cms/.env` section:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

1. **Custom Settings:**
   Edit `cms/config/database.ts` if you need custom settings.
   Start Strapi after the database is ready.

## ⚙️ Environment Variables

### **Strapi CMS**

- Copy `.env.example` to `.env` in the `cms/` directory and adjust as needed.

### **NestJS Server**

- Copy `.env.example` to `.env` in the `server/` directory and set:
  - `STRAPI_URL` (should point to your Strapi instance, e.g., `http://localhost:1337`)
  - `STRAPI_API_TOKEN` (create in Strapi admin panel under Settings → API Tokens)
  - `JWT_SECRET` (any strong secret for JWT signing)

## ✅ Verification Steps

After installation, verify that:

1. **All dependencies are installed:**

   ```bash
   cd cms && pnpm list
   cd ../server && pnpm list
   ```

## 📝 Next Steps

After completing the installation:

1. [Configure your environment variables](./how-to-configure.md)
2. [Start the applications](./how-to-start.md)
3. [Learn how to use the application](./how-to-use.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
