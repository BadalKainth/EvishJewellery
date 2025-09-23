import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      max: [10, "Maximum quantity per item is 10"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    coupon: {
      type: {
        code: { type: String },
        discount: { type: Number },
        couponType: { type: String, enum: ["percentage", "fixed"] },
      },
      default: undefined, // <- important
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ "items.product": 1 });

// Pre-save middleware to update lastUpdated
cartSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Add item
cartSchema.methods.addItem = function (productId, quantity = 1) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, 10);
  } else {
    this.items.push({ product: productId, quantity });
  }

  return this.save();
};

// Remove item
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Update quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) return this.removeItem(productId);
    item.quantity = Math.min(quantity, 10);
  }

  return this.save();
};

// Clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.coupon = undefined;
  return this.save();
};

// Populate products
cartSchema.methods.getCartWithProducts = async function () {
  await this.populate({
    path: "items.product",
    select: "name price images stock isActive primaryImage",
  });

  this.items = this.items.filter(
    (item) =>
      item.product &&
      item.product.isActive &&
      item.product.stock >= item.quantity
  );

  return this;
};

// Calculate totals
cartSchema.methods.calculateTotals = async function () {
  await this.populate("items.product");

  let subtotal = 0;
  let totalItems = 0;

  this.items.forEach((item) => {
    if (item.product && item.product.isActive) {
      subtotal += item.product.price * item.quantity;
      totalItems += item.quantity;
    }
  });

  let discount = 0;
  if (this.coupon && this.coupon.code) {
    if (this.coupon.couponType === "percentage") {
      discount = (subtotal * this.coupon.discount) / 100;
    } else if (this.coupon.couponType === "fixed") {
      discount = this.coupon.discount;
    }
    discount = Math.min(discount, subtotal);
  }

  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    totalItems,
    coupon: this.coupon,
  };
};

// Check if cart is empty
cartSchema.methods.isEmpty = function () {
  return this.items.length === 0;
};

// Get summary
cartSchema.methods.getSummary = async function () {
  const totals = await this.calculateTotals();
  return {
    itemCount: this.items.length,
    totalItems: totals.totalItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    hasCoupon: !!this.coupon?.code,
  };
};

// Find or create cart
cartSchema.statics.findOrCreate = async function (userId) {
  let cart = await this.findOne({ user: userId });
  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
};

// Virtual for item count
cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Ensure virtuals are serialized
cartSchema.set("toJSON", { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
