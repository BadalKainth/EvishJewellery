import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import User from "../models/User.js";
import {
  validateOrder,
  validateAddress,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body, query } from "express-validator";
import { sendEmail } from "../utils/email.js";
import QRCode from "qrcode";

const router = express.Router();

//
// ===============================
// Create new order
// ===============================
router.post(
  "/",
  authenticate,
  validateOrder,
  validateAddress,
  async (req, res) => {
    try {
      const {
        items: payloadItems,
        name,
        phone,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentDetails,
        notes,
      } = req.body;

      // Get user's cart
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart || cart.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty" });
      }

      // Load products into cart
      await cart.getCartWithProducts();

      const orderItems = [];
      let subtotal = 0;

      // Validate each item
      for (const item of payloadItems) {
        const product = await Product.findById(item.product);

        if (!product || !product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product ${
              product?.name || item.product
            } is not available`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.primaryImage || "/images/fallback.png",
          price: product.price,
          quantity: item.quantity,
          total: itemTotal,
        });
      }

      // Coupon handling (cart.coupon should be object)
      const couponData = cart.coupon || null;
      const discount = couponData ? Number(couponData.discount) : 0;

      // Pricing
      const shipping = 0;
      const totaltopay = subtotal - discount + shipping;
      const tax = Math.round((totaltopay * 18) / 118);
      const productAmountExclTax = totaltopay - tax;
      const total = totaltopay;

      const pricing = {
        subtotal: total,
        discount,
        shipping,
        tax,
        productAmount: productAmountExclTax,
        total,
      };

      // Set name/phone
      const orderName = name || shippingAddress?.name || req.user.name;
      const orderPhone = phone || shippingAddress?.phone || req.user.phone;

      // Create order
      const orderNumber = `ORD-${Date.now()}`;
      const order = new Order({
        user: req.user._id,
        name: orderName,
        orderNumber,
        phone: orderPhone,
        items: orderItems,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
        paymentDetails: { ...paymentDetails, paymentStatus: "pending" },
        pricing,
        coupon: couponData ? couponData.code : null, // ✅ save only string
        notes: { customer: notes || "" },
      });

      await order.save();

      // Add timeline entry
      await order.addTimelineEntry(
        "pending",
        "Order placed successfully",
        req.user._id
      );

      // Update stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sales: item.quantity },
        });
      }

      // Mark coupon used
      if (couponData?.code) {
        const coupon = await Coupon.findOne({ code: couponData.code });
        if (coupon) {
          await coupon.applyCoupon(order._id, req.user._id, discount);
        }
      }

      // Clear cart
      await cart.clearCart();

      // Send confirmation email
      try {
        await sendEmail({
          to: req.user.email,
          subject: `Order Confirmation - ${order.orderNumber}`,
          template: "orderConfirmation",
          data: {
            customerName: orderName,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt,
            status: order.status,
            items: orderItems,
            pricing: order.pricing,
            shippingAddress: order.shippingAddress,
          },
        });
      } catch (emailError) {
        console.error("Order confirmation email failed:", emailError);
      }

      // ✅ Generate UPI QR for payment
      const upiString = `upi://pay?pa=yourupi@upi&pn=YourStore&am=${total}&cu=INR`;
      let qrCode = null;
      try {
        qrCode = await QRCode.toDataURL(upiString);
      } catch (qrError) {
        console.error("QR generation failed:", qrError);
      }

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: {
          order,
          payment: {
            upiString,
            qrCode, // base64 string, frontend can render directly in <img src={qrCode} />
          },
        },
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  }
);

//
// ===============================
// Get user's orders
// ===============================
router.get(
  "/",
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
      ]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
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
      console.error("Get orders error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  }
);

//
// ===============================
// Get single order
// ===============================
router.get("/:id", authenticate, validateMongoId("id"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name images description");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

//
// ===============================
// Cancel order (user)
// ===============================
router.patch(
  "/:id/cancel",
  authenticate,
  validateMongoId("id"),
  [
    body("reason")
      .trim()
      .notEmpty()
      .withMessage("Cancellation reason is required"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { reason } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (order.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      if (!order.canBeCancelled()) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled at this stage",
        });
      }

      order.status = "cancelled";
      order.cancellation = {
        reason,
        requestedBy: "customer",
        requestedAt: new Date(),
      };

      await order.updateStatus(
        "cancelled",
        `Order cancelled by customer. Reason: ${reason}`,
        req.user._id
      );

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sales: -item.quantity },
        });
      }

      res.json({
        success: true,
        message: "Order cancelled successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to cancel order" });
    }
  }
);

//
// ===============================
// Admin: Get all orders
// ===============================
router.get(
  "/admin/all",
  authenticate,
  authorizeAdmin,
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
      ]),
    query("paymentStatus")
      .optional()
      .isIn(["pending", "completed", "failed", "refunded", "partial_refund"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, paymentStatus, page = 1, limit = 20 } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (paymentStatus) filter["paymentDetails.paymentStatus"] = paymentStatus;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await Order.find(filter)
        .populate("user", "name email phone")
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
      console.error("Get all orders error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  }
);

//
// ===============================
// Admin: Update order status
// ===============================
router.patch(
  "/:id/status",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ])
      .withMessage("Invalid status"),
    body("message").trim().notEmpty(),
    body("trackingNumber").optional().trim(),
    body("carrier").optional().trim(),
    body("estimatedDelivery").optional().isISO8601(),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { status, message, trackingNumber, carrier, estimatedDelivery } =
        req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (trackingNumber || carrier || estimatedDelivery) {
        order.tracking = {
          ...order.tracking,
          trackingNumber: trackingNumber || order.tracking?.trackingNumber,
          carrier: carrier || order.tracking?.carrier,
          estimatedDelivery: estimatedDelivery
            ? new Date(estimatedDelivery)
            : order.tracking?.estimatedDelivery,
        };
      }

      if (status === "delivered") {
        order.tracking.deliveredAt = new Date();
      }

      await order.updateStatus(status, message, req.user._id);

      try {
        const user = await User.findById(order.user);
        if (user && user.emailVerified) {
          let emailTemplate = null;
          let emailData = null;

          if (status === "shipped") {
            emailTemplate = "orderShipped";
            emailData = {
              customerName: user.name,
              orderNumber: order.orderNumber,
              trackingNumber: order.tracking.trackingNumber,
              carrier: order.tracking.carrier,
              trackingUrl: order.tracking.trackingUrl,
              estimatedDelivery: order.tracking.estimatedDelivery,
            };
          } else if (status === "delivered") {
            emailTemplate = "orderDelivered";
            emailData = {
              customerName: user.name,
              orderNumber: order.orderNumber,
              deliveredAt: order.tracking.deliveredAt,
              reviewLink: `${process.env.FRONTEND_URL}/review/${order._id}`,
            };
          }

          if (emailTemplate && emailData) {
            await sendEmail({
              to: user.email,
              template: emailTemplate,
              data: emailData,
            });
          }
        }
      } catch (emailError) {
        console.error("Status update email failed:", emailError);
      }

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }
  }
);

//
// ===============================
// Admin: Update payment status
// ===============================
router.patch(
  "/:id/payment",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("paymentStatus").isIn([
      "pending",
      "completed",
      "failed",
      "refunded",
      "partial_refund",
    ]),
    body("transactionId").optional().trim(),
    body("notes").optional().trim(),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { paymentStatus, transactionId, notes } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      order.paymentDetails.paymentStatus = paymentStatus;
      if (transactionId) order.paymentDetails.transactionId = transactionId;

      if (paymentStatus === "completed") {
        order.paymentDetails.paidAt = new Date();
        if (order.status === "pending") {
          await order.updateStatus(
            "confirmed",
            "Payment confirmed",
            req.user._id
          );
        }
      }
      if (notes) order.paymentDetails.notes = notes;

      await order.save();

      res.json({
        success: true,
        message: "Payment status updated successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Update payment status error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update payment status" });
    }
  }
);

//
// ===============================
// Admin: Order statistics
// ===============================
router.get("/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
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
    ]);

    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$pricing.total" },
        },
      },
    ]);

    const monthlyStats = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$pricing.total" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        },
        statusDistribution,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order statistics" });
  }
});

export default router;
