import express from "express";
import Coupon from "../models/Coupon.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  validateCoupon,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body, param, query } from "express-validator";

const router = express.Router();

// Get all valid coupons (public)
router.get(
  "/",
  [
    query("category")
      .optional()
      .isIn([
        "necklaces",
        "earrings",
        "bracelets",
        "rings",
        "anklets",
        "couple-sets",
        "all",
      ])
      .withMessage("Invalid category filter"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { category } = req.query;

      const filter = {
        isActive: true,
        isPublic: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      };

      // Add category filter if specified
      if (category && category !== "all") {
        filter.applicableCategories = { $in: [category, "all"] };
      }

      const coupons = await Coupon.find(filter)
        .select(
          "code name description type value minimumOrderValue maximumDiscountAmount validFrom validUntil applicableCategories"
        )
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: { coupons },
      });
    } catch (error) {
      console.error("Get coupons error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch coupons",
      });
    }
  }
);

// Validate coupon code
router.post(
  "/validate",
  authenticate,
  [
    body("code").trim().notEmpty().withMessage("Coupon code is required"),
    body("orderValue")
      .isFloat({ min: 0 })
      .withMessage("Order value must be a positive number"),
    body("category")
      .optional()
      .isIn([
        "necklaces",
        "earrings",
        "bracelets",
        "rings",
        "anklets",
        "couple-sets",
      ])
      .withMessage("Invalid category"),
    body("productIds")
      .optional()
      .isArray()
      .withMessage("Product IDs must be an array"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { code, orderValue, category, productIds = [] } = req.body;

      const validation = await Coupon.validateCoupon(
        code,
        orderValue,
        req.user._id,
        category,
        productIds
      );

      res.json({
        success: true,
        data: validation,
      });
    } catch (error) {
      console.error("Validate coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to validate coupon",
      });
    }
  }
);

// Get user's coupon usage history
router.get("/my-usage", authenticate, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      "usageHistory.user": req.user._id,
    })
      .select("code name type value usageHistory")
      .sort({ createdAt: -1 });

    const userUsageHistory = [];

    for (const coupon of coupons) {
      const userUsage = coupon.usageHistory.filter(
        (usage) => usage.user.toString() === req.user._id.toString()
      );

      if (userUsage.length > 0) {
        userUsageHistory.push({
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          usageCount: userUsage.length,
          totalDiscount: userUsage.reduce(
            (sum, usage) => sum + usage.discountAmount,
            0
          ),
          lastUsed: userUsage[userUsage.length - 1].usedAt,
        });
      }
    }

    res.json({
      success: true,
      data: { usageHistory: userUsageHistory },
    });
  } catch (error) {
    console.error("Get coupon usage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon usage history",
    });
  }
});

// Admin: Create new coupon
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateCoupon,
  async (req, res) => {
    try {
      const couponData = {
        ...req.body,
        code: req.body.code.toUpperCase(),
        createdBy: req.user._id,
      };

      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      const coupon = new Coupon(couponData);
      await coupon.save();

      res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        data: { coupon },
      });
    } catch (error) {
      console.error("Create coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create coupon",
      });
    }
  }
);

// Admin: Get all coupons
router.get(
  "/admin/all",
  authenticate,
  authorizeAdmin,
  [
    query("status")
      .optional()
      .isIn(["active", "inactive", "expired", "upcoming"])
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
      const { status, page = 1, limit = 20 } = req.query;

      let filter = {};

      // Apply status filter
      const now = new Date();
      switch (status) {
        case "active":
          filter = {
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
          };
          break;
        case "inactive":
          filter = { isActive: false };
          break;
        case "expired":
          filter = { validUntil: { $lt: now } };
          break;
        case "upcoming":
          filter = { validFrom: { $gt: now } };
          break;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const coupons = await Coupon.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalCoupons = await Coupon.countDocuments(filter);
      const totalPages = Math.ceil(totalCoupons / parseInt(limit));

      res.json({
        success: true,
        data: {
          coupons,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCoupons,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get all coupons error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch coupons",
      });
    }
  }
);

// Admin: Get single coupon
router.get(
  "/admin/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id)
        .populate("createdBy", "name")
        .populate("usageHistory.user", "name email")
        .populate("usageHistory.order", "orderNumber");

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }

      res.json({
        success: true,
        data: { coupon },
      });
    } catch (error) {
      console.error("Get coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch coupon",
      });
    }
  }
);

// Admin: Update coupon
router.put(
  "/admin/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  validateCoupon,
  async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }

      // Check if code is being changed and if new code exists
      if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
        const existingCoupon = await Coupon.findOne({
          code: req.body.code.toUpperCase(),
        });
        if (existingCoupon) {
          return res.status(400).json({
            success: false,
            message: "Coupon code already exists",
          });
        }
      }

      const updateData = {
        ...req.body,
        code: req.body.code ? req.body.code.toUpperCase() : coupon.code,
      };

      const updatedCoupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Coupon updated successfully",
        data: { coupon: updatedCoupon },
      });
    } catch (error) {
      console.error("Update coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update coupon",
      });
    }
  }
);

// Admin: Delete coupon
router.delete(
  "/admin/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }

      // Check if coupon has been used
      if (coupon.usedCount > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete coupon that has been used. Deactivate it instead.",
        });
      }

      await Coupon.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Coupon deleted successfully",
      });
    } catch (error) {
      console.error("Delete coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete coupon",
      });
    }
  }
);

// Admin: Toggle coupon status
router.patch(
  "/admin/:id/toggle",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }

      coupon.isActive = !coupon.isActive;
      await coupon.save();

      res.json({
        success: true,
        message: `Coupon ${
          coupon.isActive ? "activated" : "deactivated"
        } successfully`,
        data: { coupon },
      });
    } catch (error) {
      console.error("Toggle coupon status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle coupon status",
      });
    }
  }
);

// Admin: Get coupon statistics
router.get("/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: { $sum: { $cond: ["$isActive", 1, 0] } },
          totalUsage: { $sum: "$usedCount" },
          totalDiscountGiven: {
            $sum: { $sum: "$usageHistory.discountAmount" },
          },
        },
      },
    ]);

    const typeDistribution = await Coupon.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalUsage: { $sum: "$usedCount" },
        },
      },
    ]);

    const topCoupons = await Coupon.find({ usedCount: { $gt: 0 } })
      .select("code name type value usedCount")
      .sort({ usedCount: -1 })
      .limit(10);

    const monthlyUsage = await Coupon.aggregate([
      { $unwind: "$usageHistory" },
      {
        $group: {
          _id: {
            year: { $year: "$usageHistory.usedAt" },
            month: { $month: "$usageHistory.usedAt" },
          },
          usageCount: { $sum: 1 },
          totalDiscount: { $sum: "$usageHistory.discountAmount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalCoupons: 0,
          activeCoupons: 0,
          totalUsage: 0,
          totalDiscountGiven: 0,
        },
        typeDistribution,
        topCoupons,
        monthlyUsage,
      },
    });
  } catch (error) {
    console.error("Get coupon stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon statistics",
    });
  }
});

// Admin: Generate coupon code
router.post(
  "/admin/generate-code",
  authenticate,
  authorizeAdmin,
  [
    body("prefix")
      .optional()
      .trim()
      .isLength({ min: 2, max: 5 })
      .withMessage("Prefix must be between 2 and 5 characters"),
    body("length")
      .optional()
      .isInt({ min: 6, max: 12 })
      .withMessage("Length must be between 6 and 12 characters"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { prefix = "EVJ", length = 8 } = req.body;

      let code;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        // Generate random code
        const randomPart = Math.random()
          .toString(36)
          .substring(2, length - prefix.length + 2)
          .toUpperCase();
        code = prefix + randomPart;

        // Check if code exists
        const exists = await Coupon.findOne({ code });
        attempts++;

        if (!exists) break;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        return res.status(500).json({
          success: false,
          message: "Unable to generate unique coupon code. Please try again.",
        });
      }

      res.json({
        success: true,
        data: { code },
      });
    } catch (error) {
      console.error("Generate coupon code error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate coupon code",
      });
    }
  }
);

export default router;
