import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  handleValidationErrors,
];

export const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validatePasswordReset = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  handleValidationErrors,
];

export const validatePasswordUpdate = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
  handleValidationErrors,
];

// Product validation rules
export const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isIn([
      "necklaces",
      "earrings",
      "bracelets",
      "rings",
      "anklets",
      "couple-sets",
    ])
    .withMessage("Invalid product category"),
  body("type")
    .isIn([
      "gold",
      "silver",
      "diamond",
      "platinum",
      "rose-gold",
      "white-gold",
      "other",
    ])
    .withMessage("Invalid product type"),
  body("material")
    .trim()
    .notEmpty()
    .withMessage("Material information is required"),
  body("weight")
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  handleValidationErrors,
];

// Address validation rules
export const validateAddress = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("address")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),
  body("city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("state")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),
  body("pincode")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Please provide a valid 6-digit pincode"),
  handleValidationErrors,
];

// Order validation rules
export const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1, max: 10 })
    .withMessage("Quantity must be between 1 and 10"),
  body("paymentMethod")
    .isIn(["upi", "reference", "card", "wallet"])
    .withMessage("Invalid payment method"),
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),
  body("billingAddress").isObject().withMessage("Billing address is required"),
  handleValidationErrors,
];

// Cart validation rules
export const validateCartItem = [
  body("product").isMongoId().withMessage("Invalid product ID"),
  body("quantity")
    .isInt({ min: 1, max: 10 })
    .withMessage("Quantity must be between 1 and 10"),
  handleValidationErrors,
];

// Return validation rules
export const validateReturn = [
  body("order").isMongoId().withMessage("Invalid order ID"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Return must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.reason")
    .isIn([
      "defective",
      "wrong-item",
      "size-issue",
      "quality-issue",
      "not-as-described",
      "damaged-in-transit",
      "changed-mind",
      "other",
    ])
    .withMessage("Invalid return reason"),
  body("items.*.condition")
    .isIn(["unopened", "opened-unused", "used", "damaged"])
    .withMessage("Invalid item condition"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  handleValidationErrors,
];

// Coupon validation rules
export const validateCoupon = [
  body("code")
    .trim()
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Coupon code can only contain uppercase letters and numbers"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Coupon name must be between 2 and 100 characters"),
  body("type")
    .isIn(["percentage", "fixed"])
    .withMessage("Coupon type must be either percentage or fixed"),
  body("value")
    .isFloat({ min: 0 })
    .withMessage("Coupon value must be a positive number"),
  body("minimumOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order value must be a positive number"),
  body("maximumDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount must be a positive number"),
  body("validFrom")
    .isISO8601()
    .withMessage("Valid from date must be a valid date"),
  body("validUntil")
    .isISO8601()
    .withMessage("Valid until date must be a valid date"),
  handleValidationErrors,
];

// Parameter validation rules
export const validateMongoId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  handleValidationErrors,
];

// Query validation rules
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

export const validateProductFilters = [
  query("category")
    .optional()
    .isIn([
      "necklaces",
      "earrings",
      "bracelets",
      "rings",
      "anklets",
      "couple-sets",
    ])
    .withMessage("Invalid category filter"),
  query("type")
    .optional()
    .isIn([
      "gold",
      "silver",
      "diamond",
      "platinum",
      "rose-gold",
      "white-gold",
      "other",
    ])
    .withMessage("Invalid type filter"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number"),
  query("sort")
    .optional()
    .isIn(["price_asc", "price_desc", "newest", "oldest", "popular", "rating"])
    .withMessage("Invalid sort option"),
  handleValidationErrors,
];

// File upload validation
export const validateFileUpload = (
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 5 * 1024 * 1024
) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size: ${
          maxSize / (1024 * 1024)
        }MB`,
      });
    }

    next();
  };
};
