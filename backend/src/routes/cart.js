import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";
import {
  validateCartItem,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";
import { body } from "express-validator";

const router = express.Router();

// Get user's cart
router.get("/", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images stock isActive primaryImage"
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Get cart with calculated totals
    await cart.getCartWithProducts();
    const totals = await cart.calculateTotals();

    res.json({
      success: true,
      data: {
        cart: {
          items: cart.items,
          totals,
          itemCount: cart.itemCount,
          lastUpdated: cart.lastUpdated,
        },
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
});

// Add item to cart
router.post("/add", authenticate, validateCartItem, async (req, res) => {
  try {
    const { product, quantity } = req.body;

    // Check if product exists and is active
    const productDoc = await Product.findById(product);
    if (!productDoc || !productDoc.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unavailable",
      });
    }

    // Check stock availability
    if (productDoc.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${productDoc.stock} items available in stock`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(product, quantity);

    // Get updated cart with totals
    await cart.getCartWithProducts();
    const totals = await cart.calculateTotals();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        cart: {
          items: cart.items,
          totals,
          itemCount: cart.itemCount,
        },
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
});

// Update cart item quantity
router.put(
  "/update/:productId",
  authenticate,
  validateMongoId("productId"),
  [
    body("quantity")
      .isInt({ min: 1, max: 10 })
      .withMessage("Quantity must be between 1 and 10"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      // Check if product exists in cart
      const cartItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Product not found in cart",
        });
      }

      // Check stock availability
      const productDoc = await Product.findById(productId);
      if (!productDoc || !productDoc.isActive) {
        return res.status(404).json({
          success: false,
          message: "Product not available",
        });
      }

      if (productDoc.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${productDoc.stock} items available in stock`,
        });
      }

      // Update quantity
      await cart.updateItemQuantity(productId, quantity);

      // Get updated cart with totals
      await cart.getCartWithProducts();
      const totals = await cart.calculateTotals();

      res.json({
        success: true,
        message: "Cart updated successfully!",
        data: {
          cart: {
            items: cart.items,
            totals,
            itemCount: cart.itemCount,
          },
        },
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update.",
      });
    }
  }
);

// Remove item from cart
router.delete(
  "/remove/:productId",
  authenticate,
  validateMongoId("productId"),
  async (req, res) => {
    try {
      const { productId } = req.params;

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      // Check if product exists in cart
      const cartItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Product not found in cart",
        });
      }

      // Remove item
      await cart.removeItem(productId);

      // Get updated cart with totals
      await cart.getCartWithProducts();
      const totals = await cart.calculateTotals();

      res.json({
        success: true,
        message: "Item removed from cart successfully",
        data: {
          cart: {
            items: cart.items,
            totals,
            itemCount: cart.itemCount,
          },
        },
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart",
      });
    }
  }
);

// Clear entire cart
router.delete("/clear", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        cart: {
          items: [],
          totals: {
            subtotal: 0,
            discount: 0,
            total: 0,
            totalItems: 0,
          },
          itemCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
});

// Apply coupon to cart
router.post(
  "/apply-coupon",
  authenticate,
  [
    body("couponCode").trim().notEmpty().withMessage("Coupon code is required"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { couponCode } = req.body;

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      if (cart.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Import Coupon model (circular dependency issue, so importing here)
      const Coupon = (await import("../models/Coupon.js")).default;

      // Calculate current cart totals
      await cart.getCartWithProducts();
      const totals = await cart.calculateTotals();

      // Validate coupon
      const couponValidation = await Coupon.validateCoupon(
        couponCode,
        totals.subtotal,
        req.user._id
      );

      if (!couponValidation.valid) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message,
        });
      }

      // Apply coupon to cart
      cart.coupon = {
        code: couponCode,
        discount: couponValidation.discount,
        type: couponValidation.coupon.type,
      };

      await cart.save();

      // Recalculate totals with coupon
      const newTotals = await cart.calculateTotals();

      res.json({
        success: true,
        message: "Coupon applied successfully",
        data: {
          cart: {
            items: cart.items,
            totals: newTotals,
            itemCount: cart.itemCount,
          },
        },
      });
    } catch (error) {
      console.error("Apply coupon error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to apply coupon",
      });
    }
  }
);

// Remove coupon from cart
router.delete("/remove-coupon", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.coupon = undefined;
    await cart.save();

    // Recalculate totals without coupon
    const totals = await cart.calculateTotals();

    res.json({
      success: true,
      message: "Coupon removed successfully",
      data: {
        cart: {
          items: cart.items,
          totals,
          itemCount: cart.itemCount,
        },
      },
    });
  } catch (error) {
    console.error("Remove coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove coupon",
    });
  }
});

// Get cart summary
router.get("/summary", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const summary = await cart.getSummary();

    res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    console.error("Get cart summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart summary",
    });
  }
});

// Validate cart before checkout
router.post("/validate", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Get cart with products and validate
    await cart.getCartWithProducts();

    const validationResults = {
      isValid: true,
      issues: [],
      totals: await cart.calculateTotals(),
    };

    // Check each item for availability
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        validationResults.isValid = false;
        validationResults.issues.push({
          type: "unavailable",
          message: `${item.product?.name || "Product"} is no longer available`,
          productId: item.product?._id,
        });
      } else if (item.product.stock < item.quantity) {
        validationResults.isValid = false;
        validationResults.issues.push({
          type: "insufficient_stock",
          message: `Only ${item.product.stock} items available for ${item.product.name}`,
          productId: item.product._id,
          availableStock: item.product.stock,
        });
      }
    }

    res.json({
      success: true,
      data: validationResults,
    });
  } catch (error) {
    console.error("Validate cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate cart",
    });
  }
});

// Merge guest cart with user cart (for users who logged in with items in cart)
router.post(
  "/merge",
  authenticate,
  [
    body("guestCartItems")
      .isArray()
      .withMessage("Guest cart items must be an array"),
    body("guestCartItems.*.product")
      .isMongoId()
      .withMessage("Invalid product ID"),
    body("guestCartItems.*.quantity")
      .isInt({ min: 1, max: 10 })
      .withMessage("Quantity must be between 1 and 10"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { guestCartItems } = req.body;

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      const mergeResults = {
        added: [],
        skipped: [],
        errors: [],
      };

      // Process each guest cart item
      for (const guestItem of guestCartItems) {
        try {
          const product = await Product.findById(guestItem.product);

          if (!product || !product.isActive) {
            mergeResults.skipped.push({
              productId: guestItem.product,
              reason: "Product not available",
            });
            continue;
          }

          if (product.stock < guestItem.quantity) {
            mergeResults.skipped.push({
              productId: guestItem.product,
              reason: "Insufficient stock",
            });
            continue;
          }

          // Check if item already exists in cart
          const existingItem = cart.items.find(
            (item) => item.product.toString() === guestItem.product.toString()
          );

          if (existingItem) {
            // Update quantity if guest quantity is higher
            if (guestItem.quantity > existingItem.quantity) {
              await cart.updateItemQuantity(
                guestItem.product,
                guestItem.quantity
              );
              mergeResults.added.push({
                productId: guestItem.product,
                action: "updated",
              });
            } else {
              mergeResults.skipped.push({
                productId: guestItem.product,
                reason: "Already in cart with higher quantity",
              });
            }
          } else {
            // Add new item
            await cart.addItem(guestItem.product, guestItem.quantity);
            mergeResults.added.push({
              productId: guestItem.product,
              action: "added",
            });
          }
        } catch (error) {
          mergeResults.errors.push({
            productId: guestItem.product,
            error: error.message,
          });
        }
      }

      // Get final cart state
      await cart.getCartWithProducts();
      const totals = await cart.calculateTotals();

      res.json({
        success: true,
        message: "Cart merge completed",
        data: {
          mergeResults,
          cart: {
            items: cart.items,
            totals,
            itemCount: cart.itemCount,
          },
        },
      });
    } catch (error) {
      console.error("Merge cart error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to merge cart",
      });
    }
  }
);

export default router;
