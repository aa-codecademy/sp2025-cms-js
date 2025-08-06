# How the System Works

This guide explains the complete data flow architecture and how all components communicate with each other.

## 🏗️ Complete Data Flow Architecture

Understanding how data flows through this system is crucial for development and debugging. Here's the complete journey of a request:

### 1. **Client → NestJS Server** (Frontend to Backend)

#### Example: User visits the homepage to see articles

```javascript
// Client (client/script.js)
const response = await fetch("http://localhost:3000/api/articles", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
```

**What happens:**

- Client sends HTTP request to NestJS server
- NestJS receives request at `/api/articles` endpoint
- Server processes the request and calls Strapi CMS to fetch articles

### 2. **NestJS Server → Strapi CMS** (Backend to CMS)

#### Example: Fetching articles from Strapi

```typescript
// NestJS Server (server/src/articles/articles.service.ts)
const response = await this.strapiService.get<
  StrapiResponseDto<StrapiArticleDto[]>
>("/articles", {
  "pagination[page]": page,
  "pagination[pageSize]": pageSize,
  populate: "*",
});
```

**What happens:**

- NestJS uses `StrapiService` to communicate with Strapi
- Server sends HTTP request to `http://localhost:1337/api/articles`
- Strapi processes the request and queries the database
- Strapi returns article data in its standard format

### 3. **Strapi CMS → PostgreSQL Database** (CMS to Database)

#### Example: Strapi fetching articles from database

```typescript
// Strapi automatically handles database queries
// When you call GET /api/articles, Strapi:
// 1. Reads the schema from cms/src/api/article/content-types/article/schema.json
// 2. Generates SQL query: SELECT * FROM articles WHERE published_at IS NOT NULL
// 3. Executes query against PostgreSQL
// 4. Returns formatted JSON response
```

**What happens:**

- Strapi reads content type schemas (like `article/schema.json`)
- Generates appropriate SQL queries based on the schema
- Executes queries against PostgreSQL database
- Formats response with Strapi's standard structure

### 4. **Response Flow Back** (Database → CMS → Server → Client)

#### Example: Article data journey

```json
// 1. PostgreSQL returns raw data
{
  "id": 1,
  "title": "Getting Started with Strapi",
  "content": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Welcome to our blog!\"}]}]",
  "published_at": "2025-07-12T10:00:00Z"
}

// 2. Strapi formats it (cms/src/api/article/controllers/article.ts)
{
  "data": [{
    "id": 1,
    "attributes": {
      "title": "Getting Started with Strapi",
      "content": [...],
      "publishedAt": "2025-07-12T10:00:00Z"
    }
  }],
  "meta": { "pagination": {...} }
}

// 3. NestJS transforms it (server/src/articles/articles.service.ts)
{
  "data": [{
    "id": 1,
    "title": "Getting Started with Strapi",
    "content": [...],
    "publishedAt": "2025-07-12T10:00:00Z"
  }],
  "meta": { "pagination": {...} }
}

// 4. Client receives clean, formatted data
```

## 📝 Content Management Flow

### **Content Creation and Management**

Content is managed exclusively through Strapi's admin panel, not through API endpoints:

1. **Content Creation:**

   - Admin logs into Strapi admin panel (`http://localhost:1337/admin`)
   - Navigates to Content Manager → Articles
   - Creates new article with rich text editor
   - Sets publication status

2. **Content Publishing:**

   - Admin sets article to "Published" status
   - Article becomes available via API endpoints
   - Client applications can fetch published content

3. **Content Updates:**
   - Admin edits content through Strapi interface
   - Changes are immediately reflected in API responses
   - No need for client-side content editing

### **User Interaction Flow**

User interaction features (like contact forms, bookings) follow a different pattern:

1. **Form Submission:**

   - User fills out form on client application
   - Client sends POST request to NestJS server
   - NestJS validates and stores data in Strapi

2. **Data Storage:**
   - NestJS creates new record in Strapi
   - Data is stored for admin review
   - Admin can view submissions in Strapi admin panel

## 🔐 Authentication Flow

### **Admin Authentication**

1. **Admin Login:**

   - Admin accesses Strapi admin panel
   - Uses predefined admin credentials
   - No user registration needed

2. **Content Management:**
   - Admin manages content through Strapi interface
   - No API authentication required for content management
   - Admin interface handles all CRUD operations

### **Client Authentication (Optional)**

For features that require user authentication:

1. **User Login:**

   - Client sends login request to NestJS
   - NestJS authenticates with Strapi
   - JWT token returned to client

2. **Protected Features:**
   - Client includes JWT token in requests
   - NestJS validates token with Strapi
   - Access granted to protected features

## 🔄 Data Transformation Layers

### **Layer 1: Database Schema**

```sql
-- PostgreSQL table structure
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSONB,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Layer 2: Strapi Content Type**

```json
// cms/src/api/article/content-types/article/schema.json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "richtext"
    }
  }
}
```

### **Layer 3: NestJS DTOs**

```typescript
// server/src/articles/dto/article.dto.ts
export class ArticleDto {
  id: number;
  title: string;
  content: any;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### **Layer 4: Client Display**

```javascript
// Client-side transformation
function displayArticle(article) {
  return `
    <h2>${article.title}</h2>
    <div>${parseRichText(article.content)}</div>
    <small>Published: ${new Date(
      article.publishedAt
    ).toLocaleDateString()}</small>
  `;
}
```

## 🚀 API Endpoint Patterns

### **Content Endpoints (Read-Only)**

```typescript
// GET /api/articles - Fetch all articles
@Get()
async getArticles() {
  return this.articlesService.findAll();
}

// GET /api/articles/:id - Fetch specific article
@Get(':id')
async getArticle(@Param('id') id: string) {
  return this.articlesService.findOne(id);
}
```

### **User Interaction Endpoints**

```typescript
// POST /api/bookings - Submit booking form
@Post()
async createBooking(@Body() createBookingDto: CreateBookingDto) {
  return this.bookingsService.create(createBookingDto);
}

// POST /api/contact - Submit contact form
@Post()
async submitContact(@Body() contactDto: ContactDto) {
  return this.contactService.submit(contactDto);
}
```

## 🔧 Error Handling Flow

### **Database Errors**

```typescript
// Strapi handles database errors automatically
// If database is down, Strapi returns 500 error
```

### **API Errors**

```typescript
// NestJS catches and transforms errors
try {
  const response = await this.strapiService.get("/articles");
  return this.transformArticles(response.data);
} catch (error) {
  throw new HttpException(
    "Failed to fetch articles",
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}
```

### **Client Errors**

```javascript
// Client handles API errors gracefully
try {
  const response = await fetch("/api/articles");
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const data = await response.json();
  displayArticles(data.data);
} catch (error) {
  showErrorMessage("Failed to load articles");
}
```

## 📊 Performance Considerations

### **Caching Strategy**

1. **Client-Side Caching:**

   - Cache API responses in browser
   - Implement cache invalidation on content updates

2. **Server-Side Caching:**

   - Cache Strapi responses in NestJS
   - Use Redis for distributed caching

3. **Database Optimization:**
   - Index frequently queried fields
   - Optimize Strapi queries with pagination

### **Load Balancing**

```typescript
// Multiple NestJS instances can share the same Strapi backend
// Strapi handles database connection pooling automatically
```

## 🔍 Debugging Data Flow

### **Tracing Requests**

```bash
# 1. Check client request
curl -v http://localhost:3000/api/articles

# 2. Check NestJS logs
tail -f server/logs/app.log

# 3. Check Strapi logs
tail -f cms/.tmp/logs/strapi.log

# 4. Check database queries using pgAdmin
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Query Tool
# 3. Run: SELECT * FROM pg_stat_activity;
```

### **Common Issues**

1. **Content Not Appearing:**

   - Check publication status in Strapi
   - Verify API permissions
   - Check content type permissions

2. **API Errors:**

   - Verify Strapi is running
   - Check environment variables
   - Review NestJS logs

3. **Database Issues:**
   - Check PostgreSQL connection
   - Verify database schema
   - Review Strapi configuration

## 📝 Next Steps

After understanding the system architecture:

1. [Learn how to use the application](./how-to-use.md)
2. [Check the API reference](./api-reference.md)
3. [Explore adding new features](./how-to-add-features.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
