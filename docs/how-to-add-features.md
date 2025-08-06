# How to Add New Features

This guide covers how to extend the application with new content types, API endpoints, and functionality.

## 🔧 Adding/Expanding Functionality

### **Adding New Content Types (Read-Only)**

Content types are managed through Strapi admin panel and fetched via GET endpoints.

1. **In Strapi Admin:**

   - Go to Content-Type Builder
   - Create new content type (e.g., "Product", "Service", "Team Member")
   - Define fields and relationships
   - Set permissions for public read access

2. **In NestJS Server:**
   - Create new module (e.g., `products/`)
   - Add controller, service, and DTOs
   - Implement GET operations only
   - No authentication required for public content

### **Adding User Interaction Features**

User interaction features (POST/PUT/DELETE) are for collecting user input like bookings, contact forms, etc.

1. **In Strapi Admin:**

   - Create content types for storing user submissions
   - Set permissions to allow public POST access
   - Configure webhooks for notifications

2. **In NestJS Server:**
   - Create modules for user interaction features
   - Implement POST endpoints for form submissions
   - Add validation and error handling
   - No authentication required for public submissions

### **Adding New API Endpoints**

#### Content Endpoints (Read-Only)

```typescript
// Example: Adding a products endpoint
@Get()
async getProducts() {
  return this.productsService.findAll();
}

@Get(':id')
async getProduct(@Param('id') id: string) {
  return this.productsService.findOne(id);
}
```

#### User Interaction Endpoints

```typescript
// Example: Adding a booking endpoint
@Post()
async createBooking(@Body() createBookingDto: CreateBookingDto) {
  return this.bookingsService.create(createBookingDto);
}
```

### **Securing Endpoints**

```typescript
// Example: Protecting admin-only endpoints
@UseGuards(JwtAuthGuard)
@Get('admin/stats')
async getAdminStats() {
  return this.statsService.getAdminStats();
}
```

### **Adding Roles/Permissions**

1. **In Strapi Admin:**

   - Go to Settings → Users & Permissions → Roles
   - Create new roles (e.g., "Editor", "Author")
   - Set permissions for each content type

2. **In NestJS:**
   - Implement role-based guards for admin features
   - Keep public content endpoints unsecured

## 📝 Step-by-Step Examples

### **Example 1: Adding a "Product" Content Type**

#### **Step 1: Create Content Type in Strapi**

1. **Access Strapi Admin:**

   - Go to `http://localhost:1337/admin`
   - Navigate to Content-Type Builder

2. **Create Product Content Type:**

   - Click "Create new collection type"
   - Name: "Product"
   - Add fields:
     - `name` (Text, required)
     - `description` (Rich Text)
     - `price` (Number, required)
     - `category` (Enumeration: Electronics, Clothing, Books)
     - `image` (Media, single)
     - `inStock` (Boolean, default: true)

3. **Set Permissions:**
   - Go to Settings → Users & Permissions → Roles
   - Edit "Public" role: Allow "find" and "findOne"
   - Keep admin operations restricted to authenticated users

#### **Step 2: Create NestJS Module**

1. **Generate Module:**

   ```bash
   cd server
   nest generate module products
   nest generate controller products
   nest generate service products
   ```

2. **Create DTOs** (`server/src/products/dto/`):

   **product.dto.ts:**

   ```typescript
   import { IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

   export class ProductDto {
     @IsNumber()
     id: number;

     @IsString()
     name: string;

     @IsString()
     description: string;

     @IsNumber()
     price: number;

     @IsString()
     category: string;

     @IsBoolean()
     inStock: boolean;

     @IsString()
     @IsOptional()
     image?: string;
   }
   ```

3. **Create Service** (`server/src/products/products.service.ts`):

   ```typescript
   import { Injectable } from "@nestjs/common";
   import { StrapiService } from "../services/strapi.service";
   import { ProductDto } from "./dto/product.dto";

   @Injectable()
   export class ProductsService {
     constructor(private readonly strapiService: StrapiService) {}

     async findAll(): Promise<ProductDto[]> {
       const response = await this.strapiService.get("/products");
       return response.data.map(this.transformProduct);
     }

     async findOne(id: string): Promise<ProductDto> {
       const response = await this.strapiService.get(`/products/${id}`);
       return this.transformProduct(response.data);
     }

     private transformProduct(product: any): ProductDto {
       return {
         id: product.id,
         name: product.attributes.name,
         description: product.attributes.description,
         price: product.attributes.price,
         category: product.attributes.category,
         inStock: product.attributes.inStock,
         image: product.attributes.image?.data?.attributes?.url,
       };
     }
   }
   ```

4. **Create Controller** (`server/src/products/products.controller.ts`):

   ```typescript
   import { Controller, Get, Param } from "@nestjs/common";
   import { ProductsService } from "./products.service";
   import { ProductDto } from "./dto/product.dto";

   @Controller("products")
   export class ProductsController {
     constructor(private readonly productsService: ProductsService) {}

     @Get()
     async findAll(): Promise<ProductDto[]> {
       return this.productsService.findAll();
     }

     @Get(":id")
     async findOne(@Param("id") id: string): Promise<ProductDto> {
       return this.productsService.findOne(id);
     }
   }
   ```

### **Example 2: Adding a "Booking" User Interaction Feature**

#### **Step 1: Create Booking Content Type in Strapi**

1. **Create Booking Content Type:**

   - Name: "Booking"
   - Add fields:
     - `name` (Text, required)
     - `email` (Email, required)
     - `date` (Date, required)
     - `service` (Text, required)
     - `message` (Long Text)
     - `status` (Enumeration: pending, confirmed, cancelled)

2. **Set Permissions:**
   - Public role: Allow "create" (for form submissions)
   - Authenticated role: Allow "find", "findOne", "update", "delete"

#### **Step 2: Create NestJS Booking Module**

1. **Generate Module:**

   ```bash
   cd server
   nest generate module bookings
   nest generate controller bookings
   nest generate service bookings
   ```

2. **Create DTOs** (`server/src/bookings/dto/`):

   **create-booking.dto.ts:**

   ```typescript
   import {
     IsString,
     IsEmail,
     IsDateString,
     IsOptional,
   } from "class-validator";

   export class CreateBookingDto {
     @IsString()
     name: string;

     @IsEmail()
     email: string;

     @IsDateString()
     date: string;

     @IsString()
     service: string;

     @IsString()
     @IsOptional()
     message?: string;
   }
   ```

   **booking.dto.ts:**

   ```typescript
   export class BookingDto {
     id: number;
     name: string;
     email: string;
     date: string;
     service: string;
     message?: string;
     status: string;
     createdAt: string;
   }
   ```

3. **Create Service** (`server/src/bookings/bookings.service.ts`):

   ```typescript
   import { Injectable } from "@nestjs/common";
   import { StrapiService } from "../services/strapi.service";
   import { CreateBookingDto } from "./dto/create-booking.dto";
   import { BookingDto } from "./dto/booking.dto";

   @Injectable()
   export class BookingsService {
     constructor(private readonly strapiService: StrapiService) {}

     async create(createBookingDto: CreateBookingDto): Promise<BookingDto> {
       const response = await this.strapiService.post("/bookings", {
         data: {
           name: createBookingDto.name,
           email: createBookingDto.email,
           date: createBookingDto.date,
           service: createBookingDto.service,
           message: createBookingDto.message,
           status: "pending",
         },
       });

       return this.transformBooking(response.data);
     }

     private transformBooking(booking: any): BookingDto {
       return {
         id: booking.id,
         name: booking.attributes.name,
         email: booking.attributes.email,
         date: booking.attributes.date,
         service: booking.attributes.service,
         message: booking.attributes.message,
         status: booking.attributes.status,
         createdAt: booking.attributes.createdAt,
       };
     }
   }
   ```

4. **Create Controller** (`server/src/bookings/bookings.controller.ts`):

   ```typescript
   import { Controller, Post, Body } from "@nestjs/common";
   import { BookingsService } from "./bookings.service";
   import { CreateBookingDto } from "./dto/create-booking.dto";
   import { BookingDto } from "./dto/booking.dto";

   @Controller("bookings")
   export class BookingsController {
     constructor(private readonly bookingsService: BookingsService) {}

     @Post()
     async create(
       @Body() createBookingDto: CreateBookingDto
     ): Promise<BookingDto> {
       return this.bookingsService.create(createBookingDto);
     }
   }
   ```

## 🔧 Advanced Features

### **Adding Search Functionality**

```typescript
// In articles controller
@Get('search')
async searchArticles(@Query('q') query: string) {
  return this.articlesService.search(query);
}

// In articles service
async search(query: string) {
  const response = await this.strapiService.get(`/articles?filters[title][$containsi]=${query}`);
  return response.data.map(this.transformArticle);
}
```

### **Adding Filtering**

```typescript
// In products controller
@Get()
async getProducts(@Query('category') category?: string) {
  return this.productsService.findAll(category);
}

// In products service
async findAll(category?: string) {
  const filters = category ? `?filters[category][$eq]=${category}` : '';
  const response = await this.strapiService.get(`/products${filters}`);
  return response.data.map(this.transformProduct);
}
```

### **Adding Pagination**

```typescript
// In controller
@Get()
async getArticles(
  @Query('page') page = 1,
  @Query('pageSize') pageSize = 10
) {
  return this.articlesService.findAll(page, pageSize);
}

// In service
async findAll(page: number, pageSize: number) {
  const response = await this.strapiService.get(
    `/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
  return {
    data: response.data.map(this.transformArticle),
    meta: response.meta
  };
}
```

## 🚨 Common Issues

### **Content Type Permissions**

- Ensure public content types allow "find" and "findOne"
- User interaction content types should allow "create" for public role
- Admin operations should be restricted to authenticated users

### **API Endpoint Structure**

- Content endpoints: `GET /api/[content-type]`
- User interaction endpoints: `POST /api/[feature]`
- Keep endpoints RESTful and consistent

### **Data Transformation**

- Always transform Strapi response data to match your DTOs
- Handle optional fields and relationships properly
- Validate data before returning to clients

## 📝 Next Steps

After adding new features:

1. [Test the new endpoints](./how-to-troubleshoot.md)
2. [Update API documentation](./api-reference.md)
3. [Deploy the changes](./how-to-expand.md)

---

**Need help?** Check the [troubleshooting guide](./how-to-troubleshoot.md) for common issues and solutions.
