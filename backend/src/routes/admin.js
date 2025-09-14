import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Return from "../models/Return.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body, query } from "express-validator";

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(authorizeAdmin);

// Get admin dashboard overview
router.get("/dashboard", async (req, res) => {
  try {
    // Get basic statistics
    const [
      productStats,
      orderStats,
      userStats,
      returnStats,
      recentOrders,
      recentReturns,
      lowStockProducts,
    ] = await Promise.all([
      // Product statistics
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: { $sum: { $cond: ["$isActive", 1, 0] } },
            featuredProducts: { $sum: { $cond: ["$isFeatured", 1, 0] } },
            lowStockProducts: {
              $sum: {
                $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0],
              },
            },
            totalStock: { $sum: "$stock" },
            totalViews: { $sum: "$views" },
            totalSales: { $sum: "$sales" },
          },
        },
      ]),

      // Order statistics
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$pricing.total" },
            averageOrderValue: { $avg: "$pricing.total" },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            processingOrders: {
              $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] },
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
          },
        },
      ]),

      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
            verifiedUsers: { $sum: { $cond: ["$emailVerified", 1, 0] } },
            newUsersThisMonth: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Return statistics
      Return.aggregate([
        {
          $group: {
            _id: null,
            totalReturns: { $sum: 1 },
            pendingReturns: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            approvedReturns: {
              $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
            },
            completedReturns: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalRefundAmount: { $sum: "$refund.amount" },
          },
        },
      ]),

      // Recent orders
      Order.find({})
        .populate("user", "name email")
        .populate("items.product", "name images")
        .sort({ createdAt: -1 })
        .limit(10),

      // Recent returns
      Return.find({})
        .populate("user", "name email")
        .populate("order", "orderNumber")
        .sort({ requestedAt: -1 })
        .limit(10),

      // Low stock products
      Product.find({
        isActive: true,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      })
        .select("name stock lowStockThreshold")
        .sort({ stock: 1 })
        .limit(10),
    ]);

    // Get sales analytics for the last 12 months
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: new Date(
              new Date().getFullYear() - 1,
              new Date().getMonth(),
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$pricing.total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Get top selling products
    const topProducts = await Product.find({ isActive: true })
      .select("name sales views images price")
      .sort({ sales: -1 })
      .limit(10);

    // Get category-wise statistics
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalSales: { $sum: "$sales" },
          totalRevenue: { $sum: { $multiply: ["$price", "$sales"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          products: productStats[0] || {
            totalProducts: 0,
            activeProducts: 0,
            featuredProducts: 0,
            lowStockProducts: 0,
            totalStock: 0,
            totalViews: 0,
            totalSales: 0,
          },
          orders: orderStats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            processingOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
          },
          users: userStats[0] || {
            totalUsers: 0,
            activeUsers: 0,
            verifiedUsers: 0,
            newUsersThisMonth: 0,
          },
          returns: returnStats[0] || {
            totalReturns: 0,
            pendingReturns: 0,
            approvedReturns: 0,
            completedReturns: 0,
            totalRefundAmount: 0,
          },
        },
        recentOrders,
        recentReturns,
        lowStockProducts,
        monthlySales,
        topProducts,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

// Get analytics data
router.get(
  "/analytics",
  [
    query("period")
      .optional()
      .isIn(["7d", "30d", "90d", "1y"])
      .withMessage("Invalid period filter"),
    query("type")
      .optional()
      .isIn(["sales", "orders", "users", "products"])
      .withMessage("Invalid analytics type"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { period = "30d", type = "sales" } = req.query;

      // Calculate date range based on period
      const now = new Date();
      let startDate;

      switch (period) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1y":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      let analyticsData = {};

      switch (type) {
        case "sales":
          analyticsData = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate },
                status: "delivered",
              },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: period === "7d" ? "%Y-%m-%d" : "%Y-%m",
                      date: "$createdAt",
                    },
                  },
                },
                revenue: { $sum: "$pricing.total" },
                orders: { $sum: 1 },
              },
            },
            { $sort: { "_id.date": 1 } },
          ]);
          break;

        case "orders":
          analyticsData = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: period === "7d" ? "%Y-%m-%d" : "%Y-%m",
                      date: "$createdAt",
                    },
                  },
                  status: "$status",
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.date": 1 } },
          ]);
          break;

        case "users":
          analyticsData = await User.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: period === "7d" ? "%Y-%m-%d" : "%Y-%m",
                      date: "$createdAt",
                    },
                  },
                },
                newUsers: { $sum: 1 },
                verifiedUsers: { $sum: { $cond: ["$emailVerified", 1, 0] } },
              },
            },
            { $sort: { "_id.date": 1 } },
          ]);
          break;

        case "products":
          analyticsData = await Product.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: period === "7d" ? "%Y-%m-%d" : "%Y-%m",
                      date: "$createdAt",
                    },
                  },
                  category: "$category",
                },
                count: { $sum: 1 },
                views: { $sum: "$views" },
                sales: { $sum: "$sales" },
              },
            },
            { $sort: { "_id.date": 1 } },
          ]);
          break;
      }

      res.json({
        success: true,
        data: {
          period,
          type,
          analytics: analyticsData,
        },
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics data",
      });
    }
  }
);

// Get system health status
router.get("/system-health", async (req, res) => {
  try {
    const health = {
      database: "connected",
      email: "configured",
      storage: "available",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };

    // Check database connection
    try {
      await Product.countDocuments();
      health.database = "healthy";
    } catch (error) {
      health.database = "error";
      health.databaseError = error.message;
    }

    // Check recent error rates (simplified)
    const recentErrors = 0; // This would be tracked in a real system
    health.errorRate = recentErrors;

    res.json({
      success: true,
      data: { health },
    });
  } catch (error) {
    console.error("Get system health error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system health",
    });
  }
});

// Bulk operations for products
router.post(
  "/products/bulk",
  [
    body("action")
      .isIn(["activate", "deactivate", "delete", "update-stock"])
      .withMessage("Invalid bulk action"),
    body("productIds")
      .isArray({ min: 1 })
      .withMessage("Product IDs array is required"),
    body("data").optional().isObject().withMessage("Data must be an object"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { action, productIds, data } = req.body;

      let result;

      switch (action) {
        case "activate":
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { isActive: true, updatedBy: req.user._id }
          );
          break;

        case "deactivate":
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { isActive: false, updatedBy: req.user._id }
          );
          break;

        case "delete":
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { isActive: false, updatedBy: req.user._id }
          );
          break;

        case "update-stock":
          if (!data || data.stock === undefined) {
            return res.status(400).json({
              success: false,
              message: "Stock value is required for update-stock action",
            });
          }
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { stock: data.stock, updatedBy: req.user._id }
          );
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Invalid action",
          });
      }

      res.json({
        success: true,
        message: `Bulk ${action} completed successfully`,
        data: {
          modifiedCount: result.modifiedCount,
          matchedCount: result.matchedCount,
        },
      });
    } catch (error) {
      console.error("Bulk operations error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to perform bulk operations",
      });
    }
  }
);

// Get admin activity log (simplified version)
router.get(
  "/activity-log",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get recent orders with timeline
      const recentActivity = await Order.find({})
        .populate("user", "name email")
        .select("orderNumber status timeline createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get recent returns with timeline
      const recentReturns = await Return.find({})
        .populate("user", "name email")
        .populate("order", "orderNumber")
        .select("returnNumber status timeline requestedAt")
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Combine and format activity log
      const activityLog = [
        ...recentActivity.map((order) => ({
          id: order._id,
          type: "order",
          title: `Order ${order.orderNumber}`,
          description: `Status: ${order.status}`,
          timestamp: order.createdAt,
          user: order.user,
        })),
        ...recentReturns.map((returnReq) => ({
          id: returnReq._id,
          type: "return",
          title: `Return ${returnReq.returnNumber}`,
          description: `Status: ${returnReq.status}`,
          timestamp: returnReq.requestedAt,
          user: returnReq.user,
        })),
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      res.json({
        success: true,
        data: {
          activityLog: activityLog.slice(0, parseInt(limit)),
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(activityLog.length / parseInt(limit)),
            hasNextPage:
              parseInt(page) < Math.ceil(activityLog.length / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get activity log error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch activity log",
      });
    }
  }
);

// Export data (simplified version)
router.post(
  "/export",
  [
    body("type")
      .isIn(["products", "orders", "users", "returns"])
      .withMessage("Invalid export type"),
    body("format")
      .optional()
      .isIn(["json", "csv"])
      .withMessage("Invalid export format"),
    body("filters")
      .optional()
      .isObject()
      .withMessage("Filters must be an object"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { type, format = "json", filters = {} } = req.body;

      let data = [];

      switch (type) {
        case "products":
          data = await Product.find(filters)
            .populate("createdBy", "name")
            .select("-__v");
          break;

        case "orders":
          data = await Order.find(filters)
            .populate("user", "name email")
            .populate("items.product", "name")
            .select("-__v");
          break;

        case "users":
          data = await User.find(filters).select(
            "-password -refreshTokens -__v"
          );
          break;

        case "returns":
          data = await Return.find(filters)
            .populate("user", "name email")
            .populate("order", "orderNumber")
            .select("-__v");
          break;
      }

      if (format === "csv") {
        // Convert to CSV format (simplified)
        const csvData = data.map((item) => JSON.stringify(item)).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${type}-export.csv"`
        );
        return res.send(csvData);
      }

      res.json({
        success: true,
        message: "Data exported successfully",
        data: {
          type,
          format,
          count: data.length,
          data,
        },
      });
    } catch (error) {
      console.error("Export data error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export data",
      });
    }
  }
);

export default router;
