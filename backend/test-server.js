import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./src/config/swagger.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
// Allow all origins (wildcard CORS)
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "EvishJewellery API Documentation",
  })
);

// Mock API endpoints for testing
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "EvishJewellery API is running (Test Mode)",
    timestamp: new Date().toISOString(),
    mode: "test",
    database: "mock",
  });
});

// Mock authentication endpoints
app.post("/api/auth/register", (req, res) => {
  res.json({
    success: true,
    message: "User registered successfully (Test Mode)",
    data: {
      user: {
        _id: "test_user_id",
        name: req.body.name || "Test User",
        email: req.body.email || "test@example.com",
        role: "customer",
      },
      token: "mock_jwt_token_for_testing",
      refreshToken: "mock_refresh_token_for_testing",
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    success: true,
    message: "Login successful (Test Mode)",
    data: {
      user: {
        _id: "test_user_id",
        name: "Test User",
        email: req.body.email || "test@example.com",
        role: "customer",
      },
      token: "mock_jwt_token_for_testing",
      refreshToken: "mock_refresh_token_for_testing",
    },
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: "test_user_id",
        name: "Test User",
        email: "test@example.com",
        role: "customer",
        addresses: [],
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

// Mock products endpoints
app.get("/api/products", (req, res) => {
  const mockProducts = [
    {
      _id: "product_1",
      name: "Gold Diamond Ring",
      description: "Beautiful gold ring with diamond centerpiece",
      price: 1299.99,
      originalPrice: 1599.99,
      category: "Rings",
      type: "Wedding Ring",
      material: "Gold",
      stock: 10,
      images: ["/uploads/products/ring1.jpg"],
      isActive: true,
      isFeatured: true,
      tags: ["gold", "diamond", "wedding"],
      ratings: { average: 4.5, count: 25 },
      views: 150,
      sales: 8,
    },
    {
      _id: "product_2",
      name: "Silver Pearl Necklace",
      description: "Elegant silver necklace with pearl details",
      price: 899.99,
      originalPrice: 1099.99,
      category: "Necklaces",
      type: "Pearl Necklace",
      material: "Silver",
      stock: 15,
      images: ["/uploads/products/necklace1.jpg"],
      isActive: true,
      isFeatured: false,
      tags: ["silver", "pearl", "elegant"],
      ratings: { average: 4.2, count: 18 },
      views: 120,
      sales: 5,
    },
  ];

  res.json({
    success: true,
    data: {
      products: mockProducts,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProducts.length,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

app.get("/api/products/:id", (req, res) => {
  res.json({
    success: true,
    data: {
      product: {
        _id: req.params.id,
        name: "Gold Diamond Ring",
        description: "Beautiful gold ring with diamond centerpiece",
        price: 1299.99,
        originalPrice: 1599.99,
        category: "Rings",
        type: "Wedding Ring",
        material: "Gold",
        weight: 5.2,
        dimensions: { length: 2.5, width: 2.0, height: 1.5, unit: "cm" },
        stock: 10,
        lowStockThreshold: 5,
        images: ["/uploads/products/ring1.jpg"],
        isActive: true,
        isFeatured: true,
        tags: ["gold", "diamond", "wedding"],
        specifications: { purity: "18K", stone: "Diamond" },
        ratings: { average: 4.5, count: 25 },
        views: 150,
        sales: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

// Mock cart endpoints
app.get("/api/cart", (req, res) => {
  res.json({
    success: true,
    data: {
      _id: "cart_test_id",
      user: "test_user_id",
      items: [
        {
          product: "product_1",
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      totals: {
        subtotal: 1299.99,
        shipping: 50.0,
        tax: 135.0,
        discount: 0,
        total: 1484.99,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
});

app.post("/api/cart/items", (req, res) => {
  res.json({
    success: true,
    message: "Item added to cart successfully (Test Mode)",
    data: {
      item: {
        product: req.body.productId,
        quantity: req.body.quantity || 1,
        addedAt: new Date().toISOString(),
      },
    },
  });
});

// Mock orders endpoints
app.get("/api/orders", (req, res) => {
  const mockOrders = [
    {
      _id: "order_1",
      orderNumber: "EVJ-2024-001",
      user: "test_user_id",
      items: [
        {
          product: "product_1",
          quantity: 1,
          price: 1299.99,
          total: 1299.99,
        },
      ],
      shippingAddress: {
        type: "home",
        fullName: "Test User",
        phone: "+1234567890",
        addressLine1: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        isDefault: true,
      },
      paymentMethod: "upi",
      paymentStatus: "paid",
      paymentId: "txn_test_1234567890",
      pricing: {
        subtotal: 1299.99,
        shipping: 50.0,
        tax: 135.0,
        discount: 0,
        total: 1484.99,
      },
      status: "delivered",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-15",
      actualDelivery: new Date().toISOString(),
      timeline: [
        {
          status: "pending",
          timestamp: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          note: "Order placed",
        },
        {
          status: "delivered",
          timestamp: new Date().toISOString(),
          note: "Order delivered successfully",
        },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      orders: mockOrders,
      pagination: {
        page: 1,
        limit: 10,
        total: mockOrders.length,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

app.post("/api/orders", (req, res) => {
  res.json({
    success: true,
    message: "Order created successfully (Test Mode)",
    data: {
      order: {
        _id: "order_test_id",
        orderNumber: "EVJ-2024-TEST",
        user: "test_user_id",
        items: req.body.items || [],
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod || "upi",
        paymentStatus: "pending",
        status: "pending",
        pricing: {
          subtotal: 1299.99,
          shipping: 50.0,
          tax: 135.0,
          discount: 0,
          total: 1484.99,
        },
        timeline: [
          {
            status: "pending",
            timestamp: new Date().toISOString(),
            note: "Order placed",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

// Mock user endpoints
app.get("/api/users/profile", (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: "test_user_id",
        name: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        role: "customer",
        addresses: [
          {
            _id: "address_1",
            type: "home",
            fullName: "Test User",
            phone: "+1234567890",
            addressLine1: "123 Main Street",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            isDefault: true,
          },
        ],
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

app.put("/api/users/profile", (req, res) => {
  res.json({
    success: true,
    message: "Profile updated successfully (Test Mode)",
    data: {
      user: {
        _id: "test_user_id",
        name: req.body.name || "Test User",
        email: req.body.email || "test@example.com",
        phone: req.body.phone || "+1234567890",
        role: "customer",
        addresses: [],
        isEmailVerified: true,
        isPhoneVerified: false,
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

// Mock user addresses endpoints
app.get("/api/users/addresses", (req, res) => {
  const mockAddresses = [
    {
      _id: "address_1",
      type: "home",
      fullName: "Test User",
      phone: "+1234567890",
      addressLine1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      _id: "address_2",
      type: "work",
      fullName: "Test User",
      phone: "+1234567890",
      addressLine1: "456 Business Ave",
      addressLine2: "Suite 200",
      city: "New York",
      state: "NY",
      postalCode: "10002",
      country: "United States",
      isDefault: false,
    },
  ];

  res.json({
    success: true,
    data: {
      addresses: mockAddresses,
    },
  });
});

app.post("/api/users/addresses", (req, res) => {
  res.json({
    success: true,
    message: "Address added successfully (Test Mode)",
    data: {
      address: {
        _id: "address_new",
        type: req.body.type || "home",
        fullName: req.body.fullName || "Test User",
        phone: req.body.phone || "+1234567890",
        addressLine1: req.body.addressLine1 || "123 New Street",
        addressLine2: req.body.addressLine2 || "",
        city: req.body.city || "New York",
        state: req.body.state || "NY",
        postalCode: req.body.postalCode || "10001",
        country: req.body.country || "United States",
        isDefault: req.body.isDefault || false,
      },
    },
  });
});

app.put("/api/users/addresses/:id", (req, res) => {
  res.json({
    success: true,
    message: "Address updated successfully (Test Mode)",
    data: {
      address: {
        _id: req.params.id,
        type: req.body.type || "home",
        fullName: req.body.fullName || "Test User",
        phone: req.body.phone || "+1234567890",
        addressLine1: req.body.addressLine1 || "123 Updated Street",
        addressLine2: req.body.addressLine2 || "",
        city: req.body.city || "New York",
        state: req.body.state || "NY",
        postalCode: req.body.postalCode || "10001",
        country: req.body.country || "United States",
        isDefault: req.body.isDefault || false,
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

app.delete("/api/users/addresses/:id", (req, res) => {
  res.json({
    success: true,
    message: "Address deleted successfully (Test Mode)",
    data: {
      deletedAddressId: req.params.id,
    },
  });
});

app.get("/api/users/orders", (req, res) => {
  const mockOrders = [
    {
      _id: "order_1",
      orderNumber: "EVJ-2024-001",
      user: "test_user_id",
      items: [
        {
          product: "product_1",
          quantity: 1,
          price: 1299.99,
          total: 1299.99,
        },
      ],
      status: "delivered",
      total: 1484.99,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      orders: mockOrders,
      pagination: {
        page: 1,
        limit: 10,
        total: mockOrders.length,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

app.get("/api/users/returns", (req, res) => {
  const mockReturns = [
    {
      _id: "return_1",
      returnNumber: "RET-2024-001",
      order: "order_1",
      status: "pending",
      reason: "damaged_in_transit",
      createdAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      returns: mockReturns,
      pagination: {
        page: 1,
        limit: 10,
        total: mockReturns.length,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

app.get("/api/users/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: "test_user_id",
        name: "Test User",
        email: "test@example.com",
        totalOrders: 5,
        totalSpent: 7424.95,
        lastOrderDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      stats: {
        totalOrders: 5,
        totalSpent: 7424.95,
        totalReturns: 1,
        favoriteCategories: ["Rings", "Necklaces"],
      },
      recentOrders: [
        {
          _id: "order_1",
          orderNumber: "EVJ-2024-001",
          status: "delivered",
          total: 1484.99,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ],
    },
  });
});

// Mock coupons endpoints
app.get("/api/coupons", (req, res) => {
  const mockCoupons = [
    {
      _id: "coupon_1",
      code: "SAVE10",
      name: "10% Off Sale",
      description: "Get 10% off on all jewelry items",
      type: "percentage",
      value: 10,
      minimumOrderValue: 500,
      maximumDiscount: 200,
      usageLimit: 100,
      usedCount: 25,
      userUsageLimit: 1,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicableCategories: ["Rings", "Necklaces"],
      isActive: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: mockCoupons,
  });
});

app.post("/api/coupons/validate", (req, res) => {
  res.json({
    success: true,
    valid: true,
    data: {
      coupon: {
        _id: "coupon_1",
        code: req.body.code || "SAVE10",
        name: "10% Off Sale",
        type: "percentage",
        value: 10,
        minimumOrderValue: 500,
        maximumDiscount: 200,
      },
      discount: 129.99,
    },
  });
});

// Mock returns endpoints
app.get("/api/returns", (req, res) => {
  const mockReturns = [
    {
      _id: "return_1",
      returnNumber: "RET-2024-001",
      order: "order_1",
      user: "test_user_id",
      items: [
        {
          product: "product_1",
          quantity: 1,
          reason: "Product arrived damaged",
          condition: "damaged",
        },
      ],
      reason: "damaged_in_transit",
      description: "The product arrived with visible scratches",
      status: "pending",
      media: {
        images: ["/uploads/returns/damage1.jpg"],
        videos: [],
        comments: [],
      },
      timeline: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          note: "Return request submitted",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      returns: mockReturns,
      pagination: {
        page: 1,
        limit: 10,
        total: mockReturns.length,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

// Mock admin endpoints
app.get("/api/admin/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        totalProducts: 150,
        totalOrders: 1250,
        totalUsers: 850,
        totalRevenue: 125000.0,
        pendingReturns: 12,
        lowStockProducts: 8,
      },
      recentActivities: [
        {
          type: "order",
          message: "New order #EVJ-2024-001 placed",
          timestamp: new Date().toISOString(),
        },
        {
          type: "return",
          message: "Return request #RET-2024-001 submitted",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ],
      lowStockProducts: [
        {
          _id: "product_3",
          name: "Gold Bracelet",
          stock: 2,
          lowStockThreshold: 5,
        },
      ],
    },
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EvishJewellery API (Test Mode)",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/api/health",
    mode: "test",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      cart: "/api/cart",
      returns: "/api/returns",
      coupons: "/api/coupons",
      admin: "/api/admin",
      users: "/api/users",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    path: req.originalUrl,
    availableEndpoints: [
      "/api/health",
      "/api/auth/*",
      "/api/products/*",
      "/api/orders/*",
      "/api/cart/*",
      "/api/returns/*",
      "/api/coupons/*",
      "/api/users/*",
      "/api/admin/*",
      "/api-docs",
    ],
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 EvishJewellery API (TEST MODE) running on http://localhost:${PORT}`
  );
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(
    `🧪 Test Mode: All endpoints return mock data (no database required)`
  );
});
