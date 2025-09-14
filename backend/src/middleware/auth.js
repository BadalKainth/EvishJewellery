import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Token verification failed.",
    });
  }
};

// Admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user owns resource
export const checkOwnership = (resourceUserIdField = "user") => {
  return (req, res, next) => {
    const resourceUserId =
      req.resource?.[resourceUserIdField] || req.params.userId;

    if (req.user.role === "admin") {
      return next();
    }

    if (req.user._id.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
    }

    next();
  };
};

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : "");
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    const userAttempts = attempts.get(key) || [];
    const validAttempts = userAttempts.filter((time) => time > windowStart);

    if (validAttempts.length >= max) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please try again later.",
      });
    }

    validAttempts.push(now);
    attempts.set(key, validAttempts);

    next();
  };
};

// Email verification middleware
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required.",
      code: "EMAIL_NOT_VERIFIED",
    });
  }
  next();
};

// Phone verification middleware
export const requirePhoneVerification = (req, res, next) => {
  if (!req.user.phoneVerified) {
    return res.status(403).json({
      success: false,
      message: "Phone verification required.",
      code: "PHONE_NOT_VERIFIED",
    });
  }
  next();
};

// Check account status
export const checkAccountStatus = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Account is deactivated. Please contact support.",
      code: "ACCOUNT_DEACTIVATED",
    });
  }
  next();
};

// Middleware to update last login
export const updateLastLogin = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: new Date(),
      });
    }
    next();
  } catch (error) {
    console.error("Error updating last login:", error);
    next();
  }
};
