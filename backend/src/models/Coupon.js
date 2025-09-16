import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z0-9]+$/,
        "Coupon code can only contain uppercase letters and numbers",
      ],
    },
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      maxlength: [100, "Coupon name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Coupon type is required"],
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
      min: [0, "Coupon value cannot be negative"],
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
      min: [0, "Minimum order value cannot be negative"],
    },
    maximumDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount cannot be negative"],
    },
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },
    userUsageLimit: {
      type: Number,
      default: 1,
      min: [1, "User usage limit must be at least 1"],
    },
    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
    },
    validUntil: {
      type: Date,
      required: [true, "Valid until date is required"],
    },
    applicableCategories: [
      {
        type: String,
        enum: [
          "necklaces",
          "earrings",
          "bracelets",
          "rings",
          "anklets",
          "couple-sets",
          "all",
        ],
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usageHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        discountAmount: {
          type: Number,
          required: true,
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
couponSchema.index({ isActive: 1, isPublic: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ applicableCategories: 1 });
couponSchema.index({ createdBy: 1 });

// Virtual for remaining usage
couponSchema.virtual("remainingUsage").get(function () {
  if (this.usageLimit) {
    return Math.max(0, this.usageLimit - this.usedCount);
  }
  return null;
});

// Virtual for is valid
couponSchema.virtual("isValid").get(function () {
  const now = new Date();
  return (
    this.isActive &&
    this.validFrom <= now &&
    this.validUntil >= now &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
});

// Method to check if coupon is applicable for order
couponSchema.methods.isApplicable = function (
  orderValue,
  userId,
  category = null,
  productIds = []
) {
  // Check basic validity
  if (!this.isValid) return false;

  // Check minimum order value
  if (orderValue < this.minimumOrderValue) return false;

  // Check category applicability
  if (
    this.applicableCategories.length > 0 &&
    !this.applicableCategories.includes("all")
  ) {
    if (!category || !this.applicableCategories.includes(category))
      return false;
  }

  // Check product applicability
  if (this.applicableProducts.length > 0) {
    const hasApplicableProduct = productIds.some((id) =>
      this.applicableProducts.some(
        (productId) => productId.toString() === id.toString()
      )
    );
    if (!hasApplicableProduct) return false;
  }

  // Check user usage limit
  const userUsageCount = this.usageHistory.filter(
    (usage) => usage.user.toString() === userId.toString()
  ).length;

  if (userUsageCount >= this.userUsageLimit) return false;

  return true;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderValue) {
  if (!this.isApplicable(orderValue)) return 0;

  let discount = 0;

  if (this.type === "percentage") {
    discount = (orderValue * this.value) / 100;
  } else {
    discount = this.value;
  }

  // Apply maximum discount limit
  if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
    discount = this.maximumDiscountAmount;
  }

  // Discount cannot exceed order value
  discount = Math.min(discount, orderValue);

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Method to apply coupon
couponSchema.methods.applyCoupon = function (orderId, userId, discountAmount) {
  if (!this.isApplicable(0, userId)) {
    throw new Error("Coupon is not applicable");
  }

  this.usedCount += 1;
  this.usageHistory.push({
    user: userId,
    order: orderId,
    discountAmount: discountAmount,
    usedAt: new Date(),
  });

  return this.save();
};

// Method to check user eligibility
couponSchema.methods.checkUserEligibility = function (userId) {
  const userUsageCount = this.usageHistory.filter(
    (usage) => usage.user.toString() === userId.toString()
  ).length;

  return {
    canUse: userUsageCount < this.userUsageLimit,
    remainingUses: Math.max(0, this.userUsageLimit - userUsageCount),
    usedCount: userUsageCount,
  };
};

// Static method to find valid coupons
couponSchema.statics.findValidCoupons = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    isPublic: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  });
};

// Static method to validate coupon code
couponSchema.statics.validateCoupon = async function (
  code,
  orderValue,
  userId,
  category = null,
  productIds = []
) {
  const coupon = await this.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.isApplicable(orderValue, userId, category, productIds)) {
    return { valid: false, message: "Coupon is not applicable for this order" };
  }

  const discount = coupon.calculateDiscount(orderValue);

  return {
    valid: true,
    coupon: coupon,
    discount: discount,
  };
};

// Ensure virtual fields are serialized
couponSchema.set("toJSON", { virtuals: true });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
