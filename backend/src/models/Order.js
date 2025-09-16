import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      max: [10, "Maximum quantity per item is 10"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: {
      type: addressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "reference", "card", "wallet"],
      required: true,
    },
    paymentDetails: {
      upiId: String,
      referenceNumber: String,
      transactionId: String,
      paymentGateway: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded", "partial_refund"],
        default: "pending",
      },
      paidAt: Date,
      refundedAt: Date,
      refundAmount: {
        type: Number,
        default: 0,
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: [0, "Subtotal cannot be negative"],
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
      },
      shipping: {
        type: Number,
        default: 0,
        min: [0, "Shipping cost cannot be negative"],
      },
      tax: {
        type: Number,
        default: 0,
        min: [0, "Tax cannot be negative"],
      },
      total: {
        type: Number,
        required: true,
        min: [0, "Total cannot be negative"],
      },
    },
    coupon: {
      code: String,
      discount: Number,
      type: String, // percentage or fixed
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    tracking: {
      carrier: String,
      trackingNumber: String,
      trackingUrl: String,
      estimatedDelivery: Date,
      deliveredAt: Date,
      deliveryNotes: String,
    },
    notes: {
      customer: String,
      admin: String,
      internal: String,
    },
    cancellation: {
      reason: String,
      requestedBy: {
        type: String,
        enum: ["customer", "admin", "system"],
      },
      requestedAt: Date,
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      approvedAt: Date,
      refundProcessed: {
        type: Boolean,
        default: false,
      },
    },
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentDetails.paymentStatus": 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "timeline.timestamp": -1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `EVJ${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function (status, message, updatedBy) {
  this.timeline.push({
    status,
    message,
    updatedBy,
    timestamp: new Date(),
  });
  return this.save();
};

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus, message, updatedBy) {
  this.status = newStatus;
  this.addTimelineEntry(newStatus, message, updatedBy);
  return this.save();
};

// Method to calculate total items
orderSchema.methods.getTotalItems = function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.status);
};

// Method to check if order can be returned
orderSchema.methods.canBeReturned = function () {
  return (
    this.status === "delivered" &&
    new Date() <= new Date(this.deliveredAt.getTime() + 7 * 24 * 60 * 60 * 1000)
  ); // 7 days
};

// Virtual for order summary
orderSchema.virtual("summary").get(function () {
  return {
    orderNumber: this.orderNumber,
    status: this.status,
    totalItems: this.getTotalItems(),
    total: this.pricing.total,
    createdAt: this.createdAt,
  };
});

// Ensure virtual fields are serialized
orderSchema.set("toJSON", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
