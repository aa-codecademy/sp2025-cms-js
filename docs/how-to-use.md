# How to Use the Application

This guide covers how to use the application, including authentication, content management, and API usage.

## 📖 Using the Application

### **Authentication Flow**

1. **Login** via the client or by POSTing to `/api/auth/login`
2. **JWT Token** is returned and stored for subsequent requests
3. **Admin users** are predefined in Strapi - no registration needed

### **Content Management**

- **Articles** are managed in Strapi admin panel and fetched via the NestJS server
- **Authentication** uses Strapi's built-in Users & Permissions plugin
- **Content editing** is done through Strapi's admin interface, not the client app

## 🔐 Authentication

### **User Login**

**Via Client Interface:**

1. Open the client application
2. Click "Login" or "Sign In"
3. Enter your admin credentials
4. Submit the form

**Via API:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "your-admin-password"
  }'
```

**Response:**

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### **Using JWT Tokens**

#### Store the token

```javascript
// Client-side
localStorage.setItem("jwt", response.jwt);
```

#### Include in requests

```javascript
// Client-side
const token = localStorage.getItem("jwt");

const response = await fetch("/api/articles", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

#### API request with token

```bash
curl -X GET http://localhost:3000/api/articles \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📝 Content Management

### **Managing Articles in Strapi**

1. **Access Strapi Admin:**

   - Go to `http://localhost:1337/admin`
   - Login with your admin credentials

2. **Create Content Types:**

   - Navigate to Content-Type Builder
   - Create new content types as needed
   - Define fields and relationships

3. **Manage Articles:**
   - Go to Content Manager → Articles
   - Create, edit, or delete articles
   - Set publication status

### **Article Structure**

#### Example Article

```json
{
  "id": 1,
  "title": "Getting Started with Strapi",
  "content": [
    {
      "type": "paragraph",
      "children": [
        {
          "text": "Welcome to our blog! This is the first paragraph."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "text": "This is the second paragraph with more content."
        }
      ]
    }
  ],
  "publishedAt": "2025-07-12T10:00:00.000Z",
  "createdAt": "2025-07-12T10:00:00.000Z",
  "updatedAt": "2025-07-12T10:00:00.000Z"
}
```

### **Rich Text Content**

Strapi uses a rich text editor that stores content as JSON:

```json
{
  "type": "paragraph",
  "children": [
    {
      "text": "This is bold text",
      "bold": true
    },
    {
      "text": " and this is italic",
      "italic": true
    }
  ]
}
```

## 🔌 API Endpoints

### **Authentication Endpoints**

#### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "string", // username or email
  "password": "string"
}
```

#### Get User Profile

```bash
GET /api/auth/profile
Authorization: Bearer <jwt>
```

### **Content Endpoints (Read-Only)**

#### Get All Articles

```bash
GET /api/articles
```

#### Get Specific Article

```bash
GET /api/articles/:id
```

### **User Interaction Endpoints (Examples)**

The following endpoints are examples for adding user interaction features like bookings, newsletters, etc. They are not used for content management.

#### Create Booking (Example)

```bash
POST /api/bookings
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "date": "2025-01-15",
  "service": "consultation"
}
```

#### Subscribe to Newsletter (Example)

```bash
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "preferences": ["tech", "business"]
}
```

#### Contact Form (Example)

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## 🎯 Client Usage

### **Basic Client Operations**

#### Load Articles (Primary Use Case)

```javascript
async function loadArticles() {
  try {
    const response = await fetch("/api/articles");
    const data = await response.json();
    displayArticles(data.data);
  } catch (error) {
    console.error("Error loading articles:", error);
  }
}
```

#### Display Articles

```javascript
function displayArticles(articles) {
  const container = document.getElementById("articles-container");
  container.innerHTML = "";

  articles.forEach((article) => {
    const articleElement = document.createElement("div");
    articleElement.className = "article";

    // Extract text content from rich text
    let textContent = "";
    if (article.content && Array.isArray(article.content)) {
      article.content.forEach((paragraph) => {
        paragraph.children.forEach((child) => {
          if (child.text) textContent += child.text + " ";
        });
      });
    }

    articleElement.innerHTML = `
      <h2>${article.title}</h2>
      <p>${textContent}</p>
      <small>Published: ${new Date(
        article.publishedAt
      ).toLocaleDateString()}</small>
    `;

    container.appendChild(articleElement);
  });
}
```

### **User Interaction Examples**

#### Submit Booking Form

```javascript
async function submitBooking(bookingData) {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      console.log("Booking submitted successfully");
      // Show success message to user
    }
  } catch (error) {
    console.error("Error submitting booking:", error);
  }
}
```

#### Subscribe to Newsletter

```javascript
async function subscribeToNewsletter(email, preferences) {
  try {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, preferences }),
    });

    if (response.ok) {
      console.log("Newsletter subscription successful");
      // Show success message to user
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
  }
}
```

## 🔐 User Management

### **Strapi Admin Panel**

1. **Access Admin Panel:**

   - Go to `http://localhost:1337/admin`
   - Login with admin credentials

2. **Manage Users:**

   - Navigate to Users & Permissions → Users
   - View, edit, or delete users
   - Assign roles and permissions

3. **Manage Roles:**
   - Go to Users & Permissions → Roles
   - Create custom roles
   - Set permissions for each content type

### **User Roles and Permissions**

#### Default Roles

- **Authenticated**: Logged-in users
- **Public**: Anonymous users
- **Admin**: Full system access

#### Custom Roles

- **Editor**: Can create and edit articles
- **Author**: Can create articles only
- **Moderator**: Can approve content

## 📊 Data Management

### **Database Operations**

#### View Data in PostgreSQL

```sql
-- Connect to database using pgAdmin
-- 1. Open pgAdmin and connect to PostgreSQL
-- 2. Right-click on 'strapi' database → Query Tool
-- 3. Run the following queries:

-- View articles
SELECT * FROM articles;

-- View users
SELECT * FROM users;

-- View user roles
SELECT * FROM users_permissions_roles;
```

### **Backup and Restore**

#### Backup Database

```bash
# Using pgAdmin for backup
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Backup
# 3. Choose format (Custom recommended)
# 4. Set filename and location
# 5. Click Backup
```

#### Restore Database

```bash
# Using pgAdmin for restore
# 1. Open pgAdmin and connect to PostgreSQL
# 2. Right-click on 'strapi' database → Restore
# 3. Choose backup file
# 4. Set restore options
# 5. Click Restore
```

## 🚨 Common Usage Issues

### **Authentication Problems**

#### Token Expired

```javascript
// Check token expiration
const token = localStorage.getItem("jwt");
if (token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwt");
    // Redirect to login
  }
}
```

#### Invalid Credentials

- Check username/email spelling
- Verify password is correct
- Ensure user exists in Strapi

### **Content Issues**

#### Rich Text Display

- Parse JSON content structure
- Handle different content types
- Extract plain text for display

#### Missing Content

- Check publication status in Strapi
- Verify API permissions
- Check content type permissions

## 📝 Next Steps

After learning how to use the application:

1. [Check the API reference](./api-reference.md) for detailed endpoint documentation
2. [Learn how to add new features](./how-to-add-features.md)
3. [Explore troubleshooting options](./how-to-troubleshoot.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
