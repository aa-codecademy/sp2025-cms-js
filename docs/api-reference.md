# API Reference

This guide provides complete documentation for all API endpoints in the SP2025 CMS system.

## 🔌 API Endpoints

### **Base URL**

- **NestJS Server**: `http://localhost:3000/api`
- **Strapi CMS**: `http://localhost:1337/api`

## 🔐 Authentication Endpoints

### **Login User**

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request:**

```json
{
  "identifier": "string", // username or email
  "password": "string"
}
```

**Response:**

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "confirmed": true,
    "blocked": false,
    "createdAt": "2025-07-12T10:00:00.000Z",
    "updatedAt": "2025-07-12T10:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### **Get User Profile**

**Endpoint:** `GET /api/auth/profile`

**Description:** Get current user profile information

**Headers:**

```text
Authorization: Bearer <jwt>
```

**Response:**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "confirmed": true,
  "blocked": false,
  "createdAt": "2025-07-12T10:00:00.000Z",
  "updatedAt": "2025-07-12T10:00:00.000Z"
}
```

## 📝 Content Endpoints (Read-Only)

### **Get All Articles**

**Endpoint:** `GET /api/articles`

**Description:** Retrieve all published articles

**Query Parameters:**

- `sort` (optional): Sort field (e.g., `publishedAt:desc`)
- `pagination[page]` (optional): Page number
- `pagination[pageSize]` (optional): Items per page
- `populate` (optional): Related fields to include

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Strapi",
      "content": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Welcome to our blog!"
            }
          ]
        }
      ],
      "publishedAt": "2025-07-12T10:00:00.000Z",
      "createdAt": "2025-07-12T10:00:00.000Z",
      "updatedAt": "2025-07-12T10:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### **Get Specific Article**

**Endpoint:** `GET /api/articles/:id`

**Description:** Retrieve a specific article by ID

**Response:**

```json
{
  "data": {
    "id": 1,
    "title": "Getting Started with Strapi",
    "content": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Welcome to our blog!"
          }
        ]
      }
    ],
    "publishedAt": "2025-07-12T10:00:00.000Z",
    "createdAt": "2025-07-12T10:00:00.000Z",
    "updatedAt": "2025-07-12T10:00:00.000Z"
  }
}
```

## 🎯 User Interaction Endpoints (Examples)

The following endpoints are examples for adding user interaction features. They are not part of the core content management system but demonstrate how to add features that require user input.

### **Create Booking (Example)**

**Endpoint:** `POST /api/bookings`

**Description:** Submit a booking request

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2025-01-15",
  "service": "consultation",
  "message": "I would like to schedule a consultation"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2025-01-15",
  "service": "consultation",
  "message": "I would like to schedule a consultation",
  "status": "pending",
  "createdAt": "2025-01-10T10:00:00.000Z"
}
```

### **Subscribe to Newsletter (Example)**

**Endpoint:** `POST /api/newsletter/subscribe`

**Description:** Subscribe to newsletter

**Request:**

```json
{
  "email": "user@example.com",
  "preferences": ["tech", "business"]
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "preferences": ["tech", "business"],
  "subscribed": true,
  "createdAt": "2025-01-10T10:00:00.000Z"
}
```

### **Contact Form (Example)**

**Endpoint:** `POST /api/contact`

**Description:** Submit contact form

**Request:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services",
  "status": "received",
  "createdAt": "2025-01-10T10:00:00.000Z"
}
```

## 🔧 Content Management

### **Strapi Admin Panel**

Content management is handled through Strapi's admin panel, not through API endpoints. This ensures proper content governance and workflow management.

**Access Admin Panel:**

- URL: `http://localhost:1337/admin`
- Login with admin credentials
- Navigate to Content Manager
- Create, edit, and manage content

### **Content Workflow**

1. **Create Content:** Use Strapi admin panel
2. **Review & Edit:** Manage content through admin interface
3. **Publish:** Set publication status in Strapi
4. **Fetch:** Client applications retrieve published content via GET endpoints

## 📊 Error Responses

### **Common Error Codes**

**400 Bad Request:**

```json
{
  "statusCode": 400,
  "message": ["Field validation failed"],
  "error": "Bad Request"
}
```

**401 Unauthorized:**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**403 Forbidden:**

```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

**404 Not Found:**

```json
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found"
}
```

**500 Internal Server Error:**

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## 🔐 Authentication

### **JWT Token Usage**

1. **Login** to receive JWT token
2. **Include token** in Authorization header for protected endpoints
3. **Token format:** `Bearer <jwt>`

### **Token Expiration**

- Default expiration: 7 days
- Refresh token before expiration
- Handle expired tokens gracefully

## 📝 Next Steps

After reviewing the API reference:

1. [Learn how to use the application](./how-to-use.md)
2. [Check how to add new features](./how-to-add-features.md)
3. [Explore troubleshooting options](./how-to-troubleshoot.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
