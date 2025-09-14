import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  authenticate,
  sensitiveOperationLimit,
} from "../middleware/auth.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validatePasswordUpdate,
} from "../middleware/validation.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 8 characters)
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully. Please verify your email."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/register", validateUserRegistration, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Phone number already registered",
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
    });

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.save();

    // Generate tokens
    const token = generateToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Add refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to EvishJewellery - Verify Your Email",
        template: "emailVerification",
        data: {
          name: user.name,
          verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`,
        },
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        user: user.profile,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// Login user
router.post("/login", validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Add refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.profile,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
    });
  }
});

// Resend verification email
router.post("/resend-verification", authenticate, async (req, res) => {
  try {
    const user = req.user;

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - EvishJewellery",
      template: "emailVerification",
      data: {
        name: user.name,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`,
      },
    });

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email",
    });
  }
});

// Forgot password
router.post(
  "/forgot-password",
  validatePasswordReset,
  sensitiveOperationLimit(),
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        // Don't reveal if email exists or not
        return res.json({
          success: true,
          message: "If the email exists, a password reset link has been sent",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send reset email
      try {
        await sendEmail({
          to: user.email,
          subject: "Password Reset - EvishJewellery",
          template: "passwordReset",
          data: {
            name: user.name,
            resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
          },
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return res.status(500).json({
          success: false,
          message: "Failed to send reset email",
        });
      }

      res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Password reset request failed",
      });
    }
  }
);

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Invalidate all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
});

// Change password (authenticated users)
router.post(
  "/change-password",
  authenticate,
  validatePasswordUpdate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Get user with password
      const userWithPassword = await User.findById(user._id).select(
        "+password"
      );

      // Verify current password
      const isCurrentPasswordValid = await userWithPassword.comparePassword(
        currentPassword
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      userWithPassword.password = newPassword;

      // Invalidate all refresh tokens except current one
      userWithPassword.refreshTokens = userWithPassword.refreshTokens.filter(
        (tokenObj) =>
          tokenObj.token !== req.headers.authorization?.replace("Bearer ", "")
      );

      await userWithPassword.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Password change failed",
      });
    }
  }
);

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(
      (tokenObj) => tokenObj.token === refreshToken
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const newToken = generateToken({ id: user._id, email: user.email });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (tokenObj) => tokenObj.token !== refreshToken
    );
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed",
    });
  }
});

// Logout
router.post("/logout", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Remove current refresh token
    user.refreshTokens = user.refreshTokens.filter(
      (tokenObj) => tokenObj.token !== token
    );
    await user.save();

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

// Logout from all devices
router.post("/logout-all", authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout from all devices failed",
    });
  }
});

// Get current user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        user: user.profile,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
});

export default router;
