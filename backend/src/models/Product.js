import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    size: { type: String, required: true },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "necklaces",
        "earrings",
        "bracelets",
        "rings",
        "anklets",
        "couple-sets",
        "bags",
        "women-dress",
        "watch",
      ],
      lowercase: true,
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      enum: [
        "gold",
        "silver",
        "diamond",
        "platinum",
        "rose-gold",
        "white-gold",
        "cotton",
        "other",
      ],
      lowercase: true,
    },
    material: {
      type: String,
      required: [true, "Material information is required"],
    },
    weight: {
      type: Number,
      required: [true, "Product weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, "Length cannot be negative"],
      },
      width: {
        type: Number,
        min: [0, "Width cannot be negative"],
      },
      height: {
        type: Number,
        min: [0, "Height cannot be negative"],
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      purity: String, // e.g., "18K", "22K", "925 Sterling"
      gemstones: [String],
      finish: String, // e.g., "polished", "brushed", "matte"
      care: String,
      warranty: String,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be negative"],
        max: [5, "Rating cannot exceed 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, "Sales cannot be negative"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, type: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ "ratings.average": -1 });
productSchema.index({ sales: -1 });
productSchema.index({ views: -1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual("primaryImage").get(function () {
  if (!Array.isArray(this.images) || this.images.length === 0) {
    return null;
  }

  const primaryImg = this.images.find((img) => img.isPrimary);
  return primaryImg ? primaryImg.url : this.images[0].url;
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out-of-stock";
  if (this.stock <= this.lowStockThreshold) return "low-stock";
  return "in-stock";
});

// Method to update stock
productSchema.methods.updateStock = function (quantity) {
  if (this.stock + quantity < 0) {
    throw new Error("Insufficient stock");
  }
  this.stock += quantity;
  return this.save();
};

// Method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// Static method to get products by category
productSchema.statics.getByCategory = function (category, options = {}) {
  return this.find({ category, isActive: true, ...options });
};

// Static method to search products
productSchema.statics.searchProducts = function (query, options = {}) {
  return this.find({
    $text: { $search: query },
    isActive: true,
    ...options,
  });
};

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
