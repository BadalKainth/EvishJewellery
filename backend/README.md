# EvishJewellery Backend API

A comprehensive Node.js/Express.js backend API for the EvishJewellery e-commerce platform, built with MongoDB and featuring complete admin dashboard functionality.

## 🚀 Features

### Core Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Management** - Full CRUD operations with categories, types, and inventory management
- **Shopping Cart** - Persistent cart with real-time stock validation
- **Order Management** - Complete order lifecycle with status tracking
- **Return Management** - Return requests with media support (images/videos/comments)
- **Coupon System** - Flexible discount system with usage tracking
- **Email Notifications** - Automated emails for orders, returns, and account actions
- **Admin Dashboard** - Comprehensive admin panel with analytics and bulk operations

### Admin Dashboard Features

1. **Product Management**

   - Edit product data (name, description, price, images, specifications)
   - Edit stock quantities with bulk operations
   - Manage product categories and types
   - Set featured products and low stock alerts

2. **Order Management**

   - View all orders with advanced filtering
   - Track order status and update timelines
   - Manage payment confirmations
   - Handle order cancellations

3. **Return Management**

   - View all return requests with customer comments
   - Access return videos provided by customers
   - Approve/reject return requests
   - Process refunds and track return status
   - Manage pickup scheduling

4. **Analytics & Reports**
   - Sales analytics and revenue tracking
   - Product performance metrics
   - User analytics and registration trends
   - Return rate analytics
   - Monthly/yearly reports

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with refresh token support
- **File Upload**: Multer for handling images and videos
- **Email**: Nodemailer with HTML templates
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting, bcryptjs
- **API Documentation**: Swagger/OpenAPI 3.0 with Swagger UI
- **Image Storage**: Local storage (configurable for Cloudinary)

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Return.js
│   │   └── Coupon.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── returns.js
│   │   ├── coupons.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/           # Utility functions
│   │   └── email.js
│   ├── config/          # Configuration files
│   │   └── swagger.js   # Swagger configuration
│   └── docs/            # API documentation
│       ├── swagger-docs.js
│       ├── products-docs.js
│       ├── orders-cart-docs.js
│       └── admin-docs.js
├── uploads/             # File uploads
│   ├── products/
│   └── returns/
├── config/
│   └── env.example
├── index.js             # Main server file
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp config/env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/evishjewellery

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your_refresh_token_secret_here
   JWT_REFRESH_EXPIRE=30d

   # Email Configuration (Gmail)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Interactive Swagger Documentation

The API is fully documented using Swagger/OpenAPI 3.0. Once the server is running, you can access the interactive documentation at:

**🔗 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

#### Documentation Features

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Comprehensive Schema Definitions**: All data models and request/response formats
- **Authentication Examples**: JWT token usage and security schemes
- **Error Response Documentation**: Detailed error codes and messages
- **Request/Response Examples**: Real-world usage examples for all endpoints

#### API Overview

The documentation is organized into the following sections:

- **🔐 Authentication**: User registration, login, password management
- **🛍️ Products**: Product CRUD operations, filtering, search
- **🛒 Cart**: Shopping cart management, coupon application
- **📦 Orders**: Order creation, tracking, status updates
- **↩️ Returns**: Return request creation, media upload, processing
- **🎫 Coupons**: Coupon validation, creation, and management
- **👤 Users**: Profile management, address management
- **⚙️ Admin**: Administrative functions, analytics, bulk operations

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

```
POST /auth/register          # User registration
POST /auth/login             # User login
POST /auth/logout            # User logout
POST /auth/forgot-password   # Password reset request
POST /auth/reset-password    # Reset password
POST /auth/refresh           # Refresh JWT token
GET  /auth/me                # Get current user
```

### Product Endpoints

```
GET    /products                    # Get all products (public)
GET    /products/:id                # Get single product
POST   /products                    # Create product (admin)
PUT    /products/:id                # Update product (admin)
DELETE /products/:id                # Delete product (admin)
PATCH  /products/:id/stock          # Update stock (admin)
GET    /products/category/:category # Get products by category
GET    /products/featured/products  # Get featured products
GET    /products/search/query       # Search products
GET    /products/admin/stats        # Product statistics (admin)
```

### Order Endpoints

```
POST   /orders                      # Create order
GET    /orders                      # Get user orders
GET    /orders/:id                  # Get single order
PATCH  /orders/:id/cancel           # Cancel order
GET    /orders/admin/all            # Get all orders (admin)
PATCH  /orders/:id/status           # Update order status (admin)
PATCH  /orders/:id/payment          # Update payment status (admin)
GET    /orders/admin/stats          # Order statistics (admin)
```

### Cart Endpoints

```
GET    /cart                        # Get user cart
POST   /cart/add                    # Add item to cart
PUT    /cart/update/:productId      # Update cart item
DELETE /cart/remove/:productId      # Remove item from cart
DELETE /cart/clear                  # Clear entire cart
POST   /cart/apply-coupon           # Apply coupon
DELETE /cart/remove-coupon          # Remove coupon
GET    /cart/summary                # Get cart summary
POST   /cart/validate               # Validate cart before checkout
POST   /cart/merge                  # Merge guest cart
```

### Return Endpoints

```
POST   /returns                     # Create return request
POST   /returns/:id/media           # Upload return media
GET    /returns                     # Get user returns
GET    /returns/:id                 # Get single return
PATCH  /returns/:id/cancel          # Cancel return request
GET    /returns/admin/all           # Get all returns (admin)
PATCH  /returns/:id/status          # Update return status (admin)
PATCH  /returns/:id/pickup          # Update pickup details (admin)
GET    /returns/admin/stats         # Return statistics (admin)
```

### Coupon Endpoints

```
GET    /coupons                     # Get valid coupons (public)
POST   /coupons/validate            # Validate coupon code
GET    /coupons/my-usage            # Get user coupon usage
POST   /coupons                     # Create coupon (admin)
GET    /coupons/admin/all           # Get all coupons (admin)
GET    /coupons/admin/:id           # Get single coupon (admin)
PUT    /coupons/admin/:id           # Update coupon (admin)
DELETE /coupons/admin/:id           # Delete coupon (admin)
PATCH  /coupons/admin/:id/toggle    # Toggle coupon status (admin)
GET    /coupons/admin/stats         # Coupon statistics (admin)
POST   /coupons/admin/generate-code # Generate coupon code (admin)
```

### User Endpoints

```
GET    /users/profile               # Get user profile
PUT    /users/profile               # Update user profile
POST   /users/addresses             # Add address
PUT    /users/addresses/:id         # Update address
DELETE /users/addresses/:id         # Delete address
GET    /users/orders                # Get user orders
GET    /users/returns               # Get user returns
GET    /users/dashboard             # Get user dashboard
GET    /users/admin/all             # Get all users (admin)
GET    /users/admin/:id             # Get user details (admin)
PATCH  /users/admin/:id/status      # Update user status (admin)
GET    /users/admin/stats           # User statistics (admin)
```

### Admin Endpoints

```
GET    /admin/dashboard             # Admin dashboard overview
GET    /admin/analytics             # Analytics data
GET    /admin/system-health         # System health status
POST   /admin/products/bulk         # Bulk product operations
GET    /admin/activity-log          # Activity log
POST   /admin/export                # Export data
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **customer**: Regular users who can browse, purchase, and manage their account
- **admin**: Full access to all admin features and data management

## 📊 Database Models

### User Model

- Personal information (name, email, phone)
- Authentication data (password, tokens)
- Address management
- Account status and verification

### Product Model

- Product details (name, description, price)
- Inventory management (stock, low stock alerts)
- Categories and types
- Images and specifications
- Sales and view tracking

### Order Model

- Order items and pricing
- Shipping and billing addresses
- Payment details and status
- Order timeline and tracking
- Cancellation handling

### Cart Model

- User cart items
- Coupon application
- Real-time validation

### Return Model

- Return items and reasons
- Media attachments (images/videos/comments)
- Refund processing
- Pickup scheduling
- Timeline tracking

### Coupon Model

- Coupon configuration
- Usage tracking and limits
- Validity periods
- Category/product restrictions

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Access and refresh tokens
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation

## 📧 Email System

Automated email notifications for:

- User registration and email verification
- Password reset
- Order confirmations
- Order status updates
- Return notifications

Email templates are HTML-based with responsive design.

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `EMAIL_*`: Email service configuration
- `CLOUDINARY_*`: Image storage configuration (optional)

### File Uploads

- Product images: `uploads/products/`
- Return media: `uploads/returns/`
- Supported formats: JPEG, PNG, GIF, MP4, AVI, MOV, WebM
- Maximum file size: 10MB

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secrets
4. Configure email service
5. Set up file storage (Cloudinary recommended)
6. Configure CORS for production domain
7. Set up SSL/HTTPS
8. Configure reverse proxy (nginx)

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

## 🔄 Version History

- **v1.0.0** - Initial release with full e-commerce functionality
  - User authentication and management
  - Product management with admin controls
  - Order processing and tracking
  - Return management with media support
  - Coupon and discount system
  - Comprehensive admin dashboard
  - Email notifications
  - File upload handling

---

**Built with ❤️ for EvishJewellery E-commerce Platform**
