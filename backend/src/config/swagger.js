import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EvishJewellery API",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce API for jewelry management with admin dashboard, user authentication, order management, and return processing.",
      contact: {
        name: "EvishJewellery Support",
        email: "support@evishjewellery.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.evishjewellery.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john@example.com",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "+1234567890",
            },
            role: {
              type: "string",
              enum: ["customer", "admin"],
              description: "User role",
              example: "customer",
            },
            addresses: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Address",
              },
            },
            isEmailVerified: {
              type: "boolean",
              description: "Email verification status",
              example: true,
            },
            isPhoneVerified: {
              type: "boolean",
              description: "Phone verification status",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Address: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Address ID",
            },
            type: {
              type: "string",
              enum: ["home", "work", "other"],
              description: "Address type",
            },
            fullName: {
              type: "string",
              description: "Full name for delivery",
              example: "John Doe",
            },
            phone: {
              type: "string",
              description: "Contact phone number",
              example: "+1234567890",
            },
            addressLine1: {
              type: "string",
              description: "Primary address line",
              example: "123 Main Street",
            },
            addressLine2: {
              type: "string",
              description: "Secondary address line",
              example: "Apt 4B",
            },
            city: {
              type: "string",
              description: "City name",
              example: "New York",
            },
            state: {
              type: "string",
              description: "State or province",
              example: "NY",
            },
            postalCode: {
              type: "string",
              description: "Postal or ZIP code",
              example: "10001",
            },
            country: {
              type: "string",
              description: "Country name",
              example: "United States",
            },
            isDefault: {
              type: "boolean",
              description: "Whether this is the default address",
              example: true,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Product name",
              example: "Gold Diamond Ring",
            },
            description: {
              type: "string",
              description: "Product description",
              example: "Beautiful gold ring with diamond centerpiece",
            },
            price: {
              type: "number",
              format: "float",
              description: "Product price",
              example: 1299.99,
            },
            originalPrice: {
              type: "number",
              format: "float",
              description: "Original price before discount",
              example: 1599.99,
            },
            category: {
              type: "string",
              description: "Product category",
              example: "Rings",
            },
            type: {
              type: "string",
              description: "Product type",
              example: "Wedding Ring",
            },
            material: {
              type: "string",
              description: "Primary material",
              example: "Gold",
            },
            weight: {
              type: "number",
              format: "float",
              description: "Product weight in grams",
              example: 5.2,
            },
            dimensions: {
              type: "object",
              properties: {
                length: { type: "number", example: 2.5 },
                width: { type: "number", example: 2.0 },
                height: { type: "number", example: 1.5 },
                unit: { type: "string", example: "cm" },
              },
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Product image URLs",
            },
            stock: {
              type: "number",
              description: "Available stock quantity",
              example: 10,
            },
            lowStockThreshold: {
              type: "number",
              description: "Low stock warning threshold",
              example: 5,
            },
            isActive: {
              type: "boolean",
              description: "Product availability status",
              example: true,
            },
            isFeatured: {
              type: "boolean",
              description: "Featured product status",
              example: false,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Product tags",
              example: ["gold", "diamond", "wedding"],
            },
            specifications: {
              type: "object",
              description: "Additional product specifications",
            },
            ratings: {
              type: "object",
              properties: {
                average: { type: "number", example: 4.5 },
                count: { type: "number", example: 25 },
              },
            },
            views: {
              type: "number",
              description: "Product view count",
              example: 150,
            },
            sales: {
              type: "number",
              description: "Total sales count",
              example: 8,
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Order ID",
              example: "507f1f77bcf86cd799439011",
            },
            orderNumber: {
              type: "string",
              description: "Unique order number",
              example: "EVJ-2024-001",
            },
            user: {
              type: "string",
              description: "User ID who placed the order",
              example: "507f1f77bcf86cd799439011",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            shippingAddress: {
              $ref: "#/components/schemas/Address",
            },
            billingAddress: {
              $ref: "#/components/schemas/Address",
            },
            paymentMethod: {
              type: "string",
              enum: ["card", "upi", "netbanking", "cod"],
              description: "Payment method used",
              example: "upi",
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "failed", "refunded"],
              description: "Payment status",
              example: "paid",
            },
            paymentId: {
              type: "string",
              description: "Payment gateway transaction ID",
              example: "txn_1234567890",
            },
            pricing: {
              type: "object",
              properties: {
                subtotal: { type: "number", example: 1299.99 },
                shipping: { type: "number", example: 50.0 },
                tax: { type: "number", example: 135.0 },
                discount: { type: "number", example: 100.0 },
                total: { type: "number", example: 1384.99 },
              },
            },
            coupon: {
              type: "object",
              properties: {
                code: { type: "string", example: "SAVE10" },
                discount: { type: "number", example: 100.0 },
              },
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
              ],
              description: "Order status",
              example: "pending",
            },
            trackingNumber: {
              type: "string",
              description: "Shipping tracking number",
              example: "TRK123456789",
            },
            estimatedDelivery: {
              type: "string",
              format: "date",
              description: "Estimated delivery date",
            },
            actualDelivery: {
              type: "string",
              format: "date-time",
              description: "Actual delivery timestamp",
            },
            cancellationReason: {
              type: "string",
              description: "Reason for order cancellation",
            },
            timeline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                  note: { type: "string" },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Order creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            product: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439011",
            },
            quantity: {
              type: "number",
              description: "Item quantity",
              example: 1,
            },
            price: {
              type: "number",
              format: "float",
              description: "Price at time of purchase",
              example: 1299.99,
            },
            total: {
              type: "number",
              format: "float",
              description: "Total price for this item",
              example: 1299.99,
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Cart ID",
              example: "507f1f77bcf86cd799439011",
            },
            user: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CartItem",
              },
            },
            coupon: {
              type: "object",
              properties: {
                code: { type: "string", example: "SAVE10" },
                discount: { type: "number", example: 100.0 },
              },
            },
            totals: {
              type: "object",
              properties: {
                subtotal: { type: "number", example: 1299.99 },
                shipping: { type: "number", example: 50.0 },
                tax: { type: "number", example: 135.0 },
                discount: { type: "number", example: 100.0 },
                total: { type: "number", example: 1384.99 },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Cart creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            product: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439011",
            },
            quantity: {
              type: "number",
              description: "Item quantity",
              example: 1,
            },
            addedAt: {
              type: "string",
              format: "date-time",
              description: "When item was added to cart",
            },
          },
        },
        Return: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Return request ID",
              example: "507f1f77bcf86cd799439011",
            },
            returnNumber: {
              type: "string",
              description: "Unique return number",
              example: "RET-2024-001",
            },
            order: {
              type: "string",
              description: "Original order ID",
              example: "507f1f77bcf86cd799439011",
            },
            user: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ReturnItem",
              },
            },
            reason: {
              type: "string",
              enum: [
                "defective",
                "wrong_item",
                "not_as_described",
                "damaged_in_transit",
                "size_issue",
                "changed_mind",
                "other",
              ],
              description: "Return reason",
              example: "defective",
            },
            description: {
              type: "string",
              description: "Detailed return description",
              example: "Product arrived with scratches",
            },
            media: {
              type: "object",
              properties: {
                images: {
                  type: "array",
                  items: { type: "string" },
                  description: "Image file paths",
                },
                videos: {
                  type: "array",
                  items: { type: "string" },
                  description: "Video file paths",
                },
                comments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      timestamp: { type: "string", format: "date-time" },
                      type: { type: "string", enum: ["user", "admin"] },
                    },
                  },
                },
              },
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "approved",
                "rejected",
                "picked_up",
                "received",
                "refunded",
                "exchanged",
              ],
              description: "Return status",
              example: "pending",
            },
            refundAmount: {
              type: "number",
              format: "float",
              description: "Refund amount",
              example: 1299.99,
            },
            refundMethod: {
              type: "string",
              enum: ["original_payment", "store_credit", "bank_transfer"],
              description: "Refund method",
              example: "original_payment",
            },
            adminNotes: {
              type: "string",
              description: "Admin notes about the return",
            },
            pickupDetails: {
              type: "object",
              properties: {
                scheduledDate: { type: "string", format: "date" },
                timeSlot: { type: "string" },
                address: { $ref: "#/components/schemas/Address" },
                contactPhone: { type: "string" },
                notes: { type: "string" },
              },
            },
            timeline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                  note: { type: "string" },
                  updatedBy: { type: "string" },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Return request creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        ReturnItem: {
          type: "object",
          properties: {
            product: {
              type: "string",
              description: "Product ID",
              example: "507f1f77bcf86cd799439011",
            },
            quantity: {
              type: "number",
              description: "Return quantity",
              example: 1,
            },
            reason: {
              type: "string",
              description: "Item-specific return reason",
              example: "Scratches on surface",
            },
            condition: {
              type: "string",
              enum: ["new", "used", "damaged"],
              description: "Item condition",
              example: "damaged",
            },
          },
        },
        Coupon: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Coupon ID",
              example: "507f1f77bcf86cd799439011",
            },
            code: {
              type: "string",
              description: "Coupon code",
              example: "SAVE10",
            },
            name: {
              type: "string",
              description: "Coupon name",
              example: "10% Off Sale",
            },
            description: {
              type: "string",
              description: "Coupon description",
              example: "Get 10% off on all jewelry items",
            },
            type: {
              type: "string",
              enum: ["percentage", "fixed"],
              description: "Discount type",
              example: "percentage",
            },
            value: {
              type: "number",
              format: "float",
              description: "Discount value",
              example: 10,
            },
            minimumOrderValue: {
              type: "number",
              format: "float",
              description: "Minimum order value required",
              example: 500,
            },
            maximumDiscount: {
              type: "number",
              format: "float",
              description: "Maximum discount amount",
              example: 200,
            },
            usageLimit: {
              type: "number",
              description: "Total usage limit",
              example: 100,
            },
            usedCount: {
              type: "number",
              description: "Number of times used",
              example: 25,
            },
            userUsageLimit: {
              type: "number",
              description: "Usage limit per user",
              example: 1,
            },
            validFrom: {
              type: "string",
              format: "date-time",
              description: "Coupon validity start date",
            },
            validUntil: {
              type: "string",
              format: "date-time",
              description: "Coupon validity end date",
            },
            applicableCategories: {
              type: "array",
              items: { type: "string" },
              description: "Applicable product categories",
              example: ["Rings", "Necklaces"],
            },
            applicableProducts: {
              type: "array",
              items: { type: "string" },
              description: "Applicable product IDs",
            },
            isActive: {
              type: "boolean",
              description: "Coupon active status",
              example: true,
            },
            isPublic: {
              type: "boolean",
              description: "Public visibility status",
              example: true,
            },
            creator: {
              type: "string",
              description: "Admin who created the coupon",
              example: "507f1f77bcf86cd799439011",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Coupon creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Something went wrong!",
            },
            error: {
              type: "string",
              description: "Detailed error information",
              example: "Detailed error message",
            },
            status: {
              type: "number",
              description: "HTTP status code",
              example: 400,
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "number",
              description: "Items per page",
              example: 10,
            },
            total: {
              type: "number",
              description: "Total number of items",
              example: 100,
            },
            pages: {
              type: "number",
              description: "Total number of pages",
              example: 10,
            },
            hasNext: {
              type: "boolean",
              description: "Whether there is a next page",
              example: true,
            },
            hasPrev: {
              type: "boolean",
              description: "Whether there is a previous page",
              example: false,
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Access denied. No token provided.",
                error: "Unauthorized",
                status: 401,
              },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Access denied. Admin privileges required.",
                error: "Forbidden",
                status: 403,
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Resource not found",
                error: "Not Found",
                status: 404,
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Validation failed",
                error: [
                  {
                    field: "email",
                    message: "Email is required",
                  },
                ],
                status: 400,
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Something went wrong!",
                error: "Internal server error",
                status: 500,
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/docs/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export default specs;
