import express from "express";
import { body } from "express-validator";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

import {
  authenticate,
  authorizeAdmin,
  optionalAuth,
} from "../middleware/auth.js";
import {
  validateProduct,
  validateProductFilters,
  validatePagination,
  validateMongoId,
  handleValidationErrors,
} from "../middleware/validation.js";

const router = express.Router();

// ---------------------
// Multer configuration
// ---------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Get all products (public with optional auth for personalized results)
router.get(
  "/",
  optionalAuth,
  validateProductFilters,
  validatePagination,
  async (req, res) => {
    try {
      const {
        category,
        type,
        minPrice,
        maxPrice,
        sort = "newest",
        search,
        page = 1,
        limit = 12,
        featured,
      } = req.query;

      // Build filter object
      const filter = { isActive: true };

      if (category) filter.category = category;
      if (type) filter.type = type;
      if (featured === "true") filter.isFeatured = true;

      // Price range filter
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      // Search filter
      if (search) {
        filter.$text = { $search: search };
      }

      // Build sort object
      let sortObj = {};
      switch (sort) {
        case "price_asc":
          sortObj = { price: 1 };
          break;
        case "price_desc":
          sortObj = { price: -1 };
          break;
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "popular":
          sortObj = { sales: -1 };
          break;
        case "rating":
          sortObj = { "ratings.average": -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const products = await Product.find(filter)
        .populate("createdBy", "name")
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v");

      // Get total count for pagination
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / parseInt(limit));

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  }
);

// Get single product by ID
router.get("/:id", validateMongoId("id"), optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// Create new product (Admin only)
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.array("images", 5), // accept up to 5 images
  async (req, res) => {
    try {
      // Build image objects from uploaded files
      const imageUrls = req.files.map((file, idx) => ({
        url: `/uploads/${file.filename}`,
        isPrimary: idx === 0,
      }));

      const productData = {
        ...req.body,
        images: imageUrls, // ✅ attach images
        createdBy: req.user._id,
      };

      const product = new Product(productData);
      await product.save();

      await product.populate("createdBy", "name");

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: { product },
      });
    } catch (error) {
      console.error("Create product error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create product",
      });
    }
  }
);

// Update product (Admin only)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  validateProduct,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const updateData = {
        ...req.body,
        updatedBy: req.user._id,
      };

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate("createdBy", "name")
        .populate("updatedBy", "name");

      res.json({
        success: true,
        message: "Product updated successfully",
        data: { product: updatedProduct },
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product",
      });
    }
  }
);

// Delete product (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Soft delete - just deactivate the product
      product.isActive = false;
      await product.save();

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete product",
      });
    }
  }
);

// Update product stock (Admin only)
router.patch(
  "/:id/stock",
  authenticate,
  authorizeAdmin,
  validateMongoId("id"),
  [
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
    body("operation")
      .optional()
      .isIn(["add", "subtract", "set"])
      .withMessage("Operation must be add, subtract, or set"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { stock, operation = "set", quantity } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let newStock;

      switch (operation) {
        case "add":
          newStock = product.stock + (quantity || 0);
          break;
        case "subtract":
          newStock = Math.max(0, product.stock - (quantity || 0));
          break;
        case "set":
        default:
          newStock = stock;
          break;
      }

      product.stock = newStock;
      product.updatedBy = req.user._id;
      await product.save();

      res.json({
        success: true,
        message: "Product stock updated successfully",
        data: {
          product: {
            id: product._id,
            name: product.name,
            stock: product.stock,
            stockStatus: product.stockStatus,
          },
        },
      });
    } catch (error) {
      console.error("Update stock error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product stock",
      });
    }
  }
);

// Get products by category
router.get(
  "/category/:category",
  validateProductFilters,
  validatePagination,
  async (req, res) => {
    try {
      const { category } = req.params;
      const { sort = "newest", page = 1, limit = 12 } = req.query;

      // Validate category
      const validCategories = [
        "necklaces",
        "earrings",
        "bracelets",
        "rings",
        "anklets",
        "couple-sets",
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Build sort object
      let sortObj = {};
      switch (sort) {
        case "price_asc":
          sortObj = { price: 1 };
          break;
        case "price_desc":
          sortObj = { price: -1 };
          break;
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "popular":
          sortObj = { sales: -1 };
          break;
        case "rating":
          sortObj = { "ratings.average": -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const products = await Product.find({
        category,
        isActive: true,
      })
        .populate("createdBy", "name")
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));

      const totalProducts = await Product.countDocuments({
        category,
        isActive: true,
      });
      const totalPages = Math.ceil(totalProducts / parseInt(limit));

      res.json({
        success: true,
        data: {
          products,
          category,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get products by category error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products by category",
      });
    }
  }
);

// Get featured products
router.get("/featured/products", validatePagination, async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
});

// Search products
router.get("/search/query", validatePagination, async (req, res) => {
  try {
    const { q: query, page = 1, limit = 12 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Text search with score
    const products = await Product.find(
      { $text: { $search: query }, isActive: true },
      { score: { $meta: "textScore" } }
    )
      .populate("createdBy", "name")
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments({
      $text: { $search: query },
      isActive: true,
    });
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        query,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
});

// Get product statistics (Admin only)
router.get("/admin/stats", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ["$isActive", 1, 0] } },
          totalStock: { $sum: "$stock" },
          lowStockProducts: {
            $sum: {
              $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0],
            },
          },
          totalViews: { $sum: "$views" },
          totalSales: { $sum: "$sales" },
          averageRating: { $avg: "$ratings.average" },
        },
      },
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalSales: { $sum: "$sales" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const typeStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          totalSales: { $sum: "$sales" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          totalStock: 0,
          lowStockProducts: 0,
          totalViews: 0,
          totalSales: 0,
          averageRating: 0,
        },
        categoryStats,
        typeStats,
      },
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product statistics",
    });
  }
});

export default router;
