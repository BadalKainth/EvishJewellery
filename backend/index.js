import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import dns from "node:dns";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerSpecs from "./src/config/swagger.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import cartRoutes from "./src/routes/cart.js";
import returnRoutes from "./src/routes/returns.js";
import couponRoutes from "./src/routes/coupons.js";
import adminRoutes from "./src/routes/admin.js";
import userRoutes from "./src/routes/users.js";
import uploadRoutes from "./src/routes/uploads.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/evishjewellery";
const requiredAuthEnvVars = ["JWT_SECRET", "JWT_REFRESH_SECRET"];
const missingAuthEnvVars = requiredAuthEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingAuthEnvVars.length > 0) {
  throw new Error(
    `Missing required auth environment variables: ${missingAuthEnvVars.join(", ")}`
  );
}

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_PATH || 'uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory at:', uploadsDir);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
  contentSecurityPolicy: false, // Disable CSP for static assets
}));
app.use(compression());
// app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://www.avishjewels.com',
    'https://avishjewels.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

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

// Database connection
if (mongoUri.startsWith("mongodb+srv://")) {
  const configuredDnsServers = (
    process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1"
  )
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredDnsServers.length > 0) {
    dns.setServers(configuredDnsServers);
    console.log(
      "Using custom DNS servers for MongoDB SRV lookup:",
      configuredDnsServers.join(", ")
    );
  }
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for static files
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads/')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", uploadRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "EvishJewellery API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EvishJewellery API",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/api/health",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      cart: "/api/cart",
      returns: "/api/returns",
      coupons: "/api/coupons",
      admin: "/api/admin",
      users: "/api/users",
      uploads: "/uploads",
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
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EvishJewellery API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});
