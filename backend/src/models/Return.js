import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "defective",
        "wrong-item",
        "size-issue",
        "quality-issue",
        "not-as-described",
        "damaged-in-transit",
        "changed-mind",
        "other",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["unopened", "opened-unused", "used", "damaged"],
    },
  },
  { _id: false }
);

const returnMediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "comment"],
      required: true,
    },
    url: {
      type: String,
      required: function () {
        return this.type !== "comment";
      },
    },
    content: {
      type: String,
      required: function () {
        return this.type === "comment";
      },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [returnItemSchema],
    reason: {
      type: String,
      required: true,
      enum: [
        "defective",
        "wrong-item",
        "size-issue",
        "quality-issue",
        "not-as-described",
        "damaged-in-transit",
        "changed-mind",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    media: [returnMediaSchema],
    status: {
      type: String,
      enum: [
        "pending",
        "under-review",
        "approved",
        "rejected",
        "refund-processed",
        "item-received",
        "completed",
      ],
      default: "pending",
    },
    refund: {
      amount: {
        type: Number,
        default: 0,
        min: [0, "Refund amount cannot be negative"],
      },
      method: {
        type: String,
        enum: ["original-payment", "store-credit", "bank-transfer", "upi"],
      },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      processedAt: Date,
      transactionId: String,
      notes: String,
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    pickupDetails: {
      address: {
        name: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
      },
      scheduledDate: Date,
      pickupDate: Date,
      trackingNumber: String,
      carrier: String,
      status: {
        type: String,
        enum: ["scheduled", "picked-up", "in-transit", "received"],
        default: "scheduled",
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
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
returnSchema.index({ returnNumber: 1 });
returnSchema.index({ order: 1 });
returnSchema.index({ user: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ requestedAt: -1 });
returnSchema.index({ "timeline.timestamp": -1 });

// Pre-save middleware to generate return number
returnSchema.pre("save", async function (next) {
  if (!this.returnNumber) {
    const count = await mongoose.model("Return").countDocuments();
    this.returnNumber = `RET${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Method to add timeline entry
returnSchema.methods.addTimelineEntry = function (status, message, updatedBy) {
  this.timeline.push({
    status,
    message,
    updatedBy,
    timestamp: new Date(),
  });
  return this.save();
};

// Method to update return status
returnSchema.methods.updateStatus = function (newStatus, message, updatedBy) {
  this.status = newStatus;
  this.addTimelineEntry(newStatus, message, updatedBy);

  // Set appropriate timestamps
  if (newStatus === "under-review" && !this.reviewedAt) {
    this.reviewedAt = new Date();
    this.reviewedBy = updatedBy;
  } else if (newStatus === "completed") {
    this.completedAt = new Date();
  }

  return this.save();
};

// Method to calculate total refund amount
returnSchema.methods.calculateRefundAmount = function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Method to check if return can be cancelled
returnSchema.methods.canBeCancelled = function () {
  return ["pending", "under-review"].includes(this.status);
};

// Method to add media
returnSchema.methods.addMedia = function (type, url, content) {
  this.media.push({
    type,
    url,
    content,
    uploadedAt: new Date(),
  });
  return this.save();
};

// Method to get return summary
returnSchema.methods.getSummary = function () {
  return {
    returnNumber: this.returnNumber,
    status: this.status,
    totalItems: this.items.length,
    totalQuantity: this.items.reduce((sum, item) => sum + item.quantity, 0),
    refundAmount: this.refund.amount,
    requestedAt: this.requestedAt,
    reason: this.reason,
  };
};

// Virtual for total items count
returnSchema.virtual("totalItems").get(function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Virtual for processing time
returnSchema.virtual("processingTime").get(function () {
  if (this.completedAt) {
    return Math.ceil(
      (this.completedAt - this.requestedAt) / (1000 * 60 * 60 * 24)
    ); // days
  }
  return null;
});

// Ensure virtual fields are serialized
returnSchema.set("toJSON", { virtuals: true });

const Return = mongoose.model("Return", returnSchema);

export default Return;
