import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Return from "../models/Return.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  validateAddress,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body, param, query } from "express-validator";

const router = express.Router();

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshTokens"
    );

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

// Update user profile
router.put(
  "/profile",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Please provide a valid 10-digit phone number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { name, phone } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (phone) {
        // Check if phone number is already taken by another user
        const existingUser = await User.findOne({
          phone,
          _id: { $ne: req.user._id },
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Phone number is already registered",
          });
        }

        updateData.phone = phone;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password -refreshTokens");

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }
);

// Add address
router.post("/addresses", authenticate, validateAddress, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach((address) => (address.isDefault = false));
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
});

// Update address
router.put(
  "/addresses/:addressId",
  authenticate,
  validateMongoId("addressId"),
  validateAddress,
  async (req, res) => {
    try {
      const { addressId } = req.params;
      const user = await User.findById(req.user._id);

      const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId
      );

      if (addressIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      // If setting as default, remove default from other addresses
      if (req.body.isDefault) {
        user.addresses.forEach((address) => (address.isDefault = false));
      }

      user.addresses[addressIndex] = {
        ...user.addresses[addressIndex],
        ...req.body,
      };
      await user.save();

      res.json({
        success: true,
        message: "Address updated successfully",
        data: { addresses: user.addresses },
      });
    } catch (error) {
      console.error("Update address error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update address",
      });
    }
  }
);

// Delete address
router.delete(
  "/addresses/:addressId",
  authenticate,
  validateMongoId("addressId"),
  async (req, res) => {
    try {
      const { addressId } = req.params;
      const user = await User.findById(req.user._id);

      const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId
      );

      if (addressIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      const deletedAddress = user.addresses[addressIndex];
      user.addresses.splice(addressIndex, 1);

      // If deleted address was default and there are other addresses, set first one as default
      if (deletedAddress.isDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();

      res.json({
        success: true,
        message: "Address deleted successfully",
        data: { addresses: user.addresses },
      });
    } catch (error) {
      console.error("Delete address error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete address",
      });
    }
  }
);

// Get user's order history
router.get(
  "/orders",
  authenticate,
  [
    query("status")
      .optional()
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ])
      .withMessage("Invalid status filter"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const filter = { user: req.user._id };
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await Order.find(filter)
        .populate("items.product", "name images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalOrders = await Order.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalOrders,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }
);

// Get user's return history
router.get(
  "/returns",
  authenticate,
  [
    query("status")
      .optional()
      .isIn([
        "pending",
        "under-review",
        "approved",
        "rejected",
        "refund-processed",
        "item-received",
        "completed",
      ])
      .withMessage("Invalid status filter"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      const filter = { user: req.user._id };
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const returns = await Return.find(filter)
        .populate("order", "orderNumber createdAt")
        .populate("items.product", "name images")
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalReturns = await Return.countDocuments(filter);
      const totalPages = Math.ceil(totalReturns / parseInt(limit));

      res.json({
        success: true,
        data: {
          returns,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalReturns,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get user returns error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch returns",
      });
    }
  }
);

// Get user dashboard data
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent orders
    const recentOrders = await Order.find({ user: userId })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending returns
    const pendingReturns = await Return.find({
      user: userId,
      status: { $in: ["pending", "under-review"] },
    })
      .populate("order", "orderNumber")
      .sort({ requestedAt: -1 })
      .limit(5);

    // Get user statistics
    const orderStats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$pricing.total" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          pendingOrders: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["pending", "confirmed", "processing", "shipped"],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const returnStats = await Return.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
          totalRefundAmount: { $sum: "$refund.amount" },
          pendingReturns: {
            $sum: {
              $cond: [{ $in: ["$status", ["pending", "under-review"]] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        recentOrders,
        pendingReturns,
        stats: {
          orders: orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            completedOrders: 0,
            pendingOrders: 0,
          },
          returns: returnStats[0] || {
            totalReturns: 0,
            totalRefundAmount: 0,
            pendingReturns: 0,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

// Admin: Get all users
router.get(
  "/admin/all",
  authenticate,
  authorizeAdmin,
  [
    query("role")
      .optional()
      .isIn(["customer", "admin"])
      .withMessage("Invalid role filter"),
    query("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid status filter"),
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
      const { role, status, page = 1, limit = 20 } = req.query;

      const filter = {};
      if (role) filter.role = role;
      if (status === "active") filter.isActive = true;
      if (status === "inactive") filter.isActive = false;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.find(filter)
        .select("-password -refreshTokens")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await User.countDocuments(filter);
      const totalPages = Math.ceil(totalUsers / parseInt(limit));

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

// Admin: Get single user details
router.get(
  "/admin/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select(
        "-password -refreshTokens"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user's recent orders
      const recentOrders = await Order.find({ user: user._id })
        .populate("items.product", "name images")
        .sort({ createdAt: -1 })
        .limit(10);

      // Get user's returns
      const returns = await Return.find({ user: user._id })
        .populate("order", "orderNumber")
        .sort({ requestedAt: -1 })
        .limit(10);

      res.json({
        success: true,
        data: {
          user,
          recentOrders,
          returns,
        },
      });
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user details",
      });
    }
  }
);

// Admin: Update user status
router.patch(
  "/admin/:id/status",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("isActive").isBoolean().withMessage("isActive must be a boolean"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.isActive = isActive;
      await user.save();

      res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        data: { user: user.profile },
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user status",
      });
    }
  }
);

// Admin: Get user statistics
router.get("/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
          verifiedUsers: { $sum: { $cond: ["$emailVerified", 1, 0] } },
          adminUsers: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
        },
      },
    ]);

    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    const recentUsers = await User.find({})
      .select("name email role createdAt isActive")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          adminUsers: 0,
        },
        roleDistribution,
        monthlyRegistrations,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
});

export default router;
