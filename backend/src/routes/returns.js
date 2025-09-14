import express from "express";
import Return from "../models/Return.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  validateReturn,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body, param, query } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/returns";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },
});

// Create return request
router.post("/", authenticate, validateReturn, async (req, res) => {
  try {
    const { order, items, reason, description } = req.body;

    // Check if order exists and belongs to user
    const orderDoc = await Order.findById(order);
    if (!orderDoc) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Check if order can be returned
    if (!orderDoc.canBeReturned()) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be returned. Return period has expired or order is not delivered.",
      });
    }

    // Check if return already exists for this order
    const existingReturn = await Return.findOne({ order: order });
    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: "Return request already exists for this order",
      });
    }

    // Validate return items against order items
    const returnItems = [];
    let totalRefundAmount = 0;

    for (const returnItem of items) {
      const orderItem = orderDoc.items.find(
        (item) => item.product.toString() === returnItem.product
      );

      if (!orderItem) {
        return res.status(400).json({
          success: false,
          message: `Product ${returnItem.product} not found in this order`,
        });
      }

      if (returnItem.quantity > orderItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Return quantity cannot exceed ordered quantity for ${orderItem.name}`,
        });
      }

      const product = await Product.findById(returnItem.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${returnItem.product} not found`,
        });
      }

      returnItems.push({
        product: returnItem.product,
        name: orderItem.name,
        image: orderItem.image,
        quantity: returnItem.quantity,
        price: orderItem.price,
        reason: returnItem.reason,
        condition: returnItem.condition,
      });

      totalRefundAmount += orderItem.price * returnItem.quantity;
    }

    // Create return request
    const returnRequest = new Return({
      order: order,
      user: req.user._id,
      items: returnItems,
      reason: reason,
      description: description,
      refund: {
        amount: totalRefundAmount,
        method: "original-payment",
      },
    });

    // Add initial timeline entry
    returnRequest.addTimelineEntry(
      "pending",
      "Return request submitted",
      req.user._id
    );

    await returnRequest.save();

    res.status(201).json({
      success: true,
      message: "Return request submitted successfully",
      data: { return: returnRequest },
    });
  } catch (error) {
    console.error("Create return error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit return request",
    });
  }
});

// Upload return media (images/videos/comments)
router.post(
  "/:id/media",
  authenticate,
  validateMongoId("id"),
  upload.single("media"),
  [
    body("type")
      .isIn(["image", "video", "comment"])
      .withMessage("Invalid media type"),
    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content is required for comment type"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type, content } = req.body;

      const returnRequest = await Return.findById(id);
      if (!returnRequest) {
        return res.status(404).json({
          success: false,
          message: "Return request not found",
        });
      }

      // Check if user owns this return request
      if (returnRequest.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      let mediaData = { type };

      if (type === "comment") {
        if (!content) {
          return res.status(400).json({
            success: false,
            message: "Content is required for comment type",
          });
        }
        mediaData.content = content;
      } else {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Media file is required",
          });
        }
        mediaData.url = `/uploads/returns/${req.file.filename}`;
      }

      // Add media to return request
      await returnRequest.addMedia(type, mediaData.url, content);

      res.json({
        success: true,
        message: "Media uploaded successfully",
        data: { media: mediaData },
      });
    } catch (error) {
      console.error("Upload return media error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    }
  }
);

// Get user's return requests
router.get(
  "/",
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
      console.error("Get returns error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch return requests",
      });
    }
  }
);

// Get single return request
router.get("/:id", authenticate, validateMongoId("id"), async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.id)
      .populate("order", "orderNumber createdAt items")
      .populate("user", "name email phone")
      .populate("items.product", "name images description");

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: "Return request not found",
      });
    }

    // Check if user owns this return or is admin
    if (
      returnRequest.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: { return: returnRequest },
    });
  } catch (error) {
    console.error("Get return error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch return request",
    });
  }
});

// Cancel return request (user)
router.patch(
  "/:id/cancel",
  authenticate,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const returnRequest = await Return.findById(req.params.id);

      if (!returnRequest) {
        return res.status(404).json({
          success: false,
          message: "Return request not found",
        });
      }

      // Check if user owns this return
      if (returnRequest.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if return can be cancelled
      if (!returnRequest.canBeCancelled()) {
        return res.status(400).json({
          success: false,
          message: "Return request cannot be cancelled at this stage",
        });
      }

      // Update status to cancelled
      await returnRequest.updateStatus(
        "cancelled",
        "Return request cancelled by customer",
        req.user._id
      );

      res.json({
        success: true,
        message: "Return request cancelled successfully",
        data: { return: returnRequest },
      });
    } catch (error) {
      console.error("Cancel return error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel return request",
      });
    }
  }
);

// Admin: Get all return requests
router.get(
  "/admin/all",
  authenticate,
  authorizeAdmin,
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
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const filter = {};
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const returns = await Return.find(filter)
        .populate("order", "orderNumber createdAt")
        .populate("user", "name email phone")
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
      console.error("Get all returns error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch return requests",
      });
    }
  }
);

// Admin: Update return status
router.patch(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("status")
      .isIn([
        "pending",
        "under-review",
        "approved",
        "rejected",
        "refund-processed",
        "item-received",
        "completed",
      ])
      .withMessage("Invalid status"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Status update message is required"),
    body("adminNotes").optional().trim(),
    body("refundAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Refund amount must be a positive number"),
    body("refundMethod")
      .optional()
      .isIn(["original-payment", "store-credit", "bank-transfer", "upi"])
      .withMessage("Invalid refund method"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, message, adminNotes, refundAmount, refundMethod } =
        req.body;
      const returnRequest = await Return.findById(req.params.id);

      if (!returnRequest) {
        return res.status(404).json({
          success: false,
          message: "Return request not found",
        });
      }

      // Update admin notes if provided
      if (adminNotes) {
        returnRequest.adminNotes = adminNotes;
      }

      // Update refund details if provided
      if (refundAmount !== undefined) {
        returnRequest.refund.amount = refundAmount;
      }
      if (refundMethod) {
        returnRequest.refund.method = refundMethod;
      }

      // Update status
      await returnRequest.updateStatus(status, message, req.user._id);

      // Handle special status updates
      if (status === "approved") {
        // Set pickup details if not already set
        if (!returnRequest.pickupDetails.address) {
          const order = await Order.findById(returnRequest.order);
          returnRequest.pickupDetails.address = order.shippingAddress;
          returnRequest.pickupDetails.status = "scheduled";
        }
      }

      if (status === "refund-processed") {
        returnRequest.refund.status = "processing";
        returnRequest.refund.processedAt = new Date();
      }

      if (status === "completed") {
        returnRequest.refund.status = "completed";

        // Restore product stock
        for (const item of returnRequest.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, sales: -item.quantity },
          });
        }
      }

      await returnRequest.save();

      res.json({
        success: true,
        message: "Return status updated successfully",
        data: { return: returnRequest },
      });
    } catch (error) {
      console.error("Update return status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update return status",
      });
    }
  }
);

// Admin: Update pickup details
router.patch(
  "/:id/pickup",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("address").isObject().withMessage("Pickup address is required"),
    body("scheduledDate")
      .isISO8601()
      .withMessage("Scheduled date must be a valid date"),
    body("carrier").optional().trim(),
    body("trackingNumber").optional().trim(),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { address, scheduledDate, carrier, trackingNumber } = req.body;
      const returnRequest = await Return.findById(req.params.id);

      if (!returnRequest) {
        return res.status(404).json({
          success: false,
          message: "Return request not found",
        });
      }

      // Update pickup details
      returnRequest.pickupDetails = {
        ...returnRequest.pickupDetails,
        address,
        scheduledDate: new Date(scheduledDate),
        carrier,
        trackingNumber,
        status: "scheduled",
      };

      await returnRequest.save();

      res.json({
        success: true,
        message: "Pickup details updated successfully",
        data: { return: returnRequest },
      });
    } catch (error) {
      console.error("Update pickup details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update pickup details",
      });
    }
  }
);

// Admin: Get return statistics
router.get("/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Return.aggregate([
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
          rejectedReturns: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          totalRefundAmount: { $sum: "$refund.amount" },
          averageProcessingTime: { $avg: "$processingTime" },
        },
      },
    ]);

    const statusDistribution = await Return.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRefundAmount: { $sum: "$refund.amount" },
        },
      },
    ]);

    const reasonDistribution = await Return.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalReturns: 0,
          pendingReturns: 0,
          approvedReturns: 0,
          completedReturns: 0,
          rejectedReturns: 0,
          totalRefundAmount: 0,
          averageProcessingTime: 0,
        },
        statusDistribution,
        reasonDistribution,
      },
    });
  } catch (error) {
    console.error("Get return stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch return statistics",
    });
  }
});

export default router;
