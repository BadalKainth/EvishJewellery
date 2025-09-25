import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the uploads directory path from environment variable
const uploadsDir = path.resolve(__dirname, "../../", process.env.UPLOAD_PATH || "uploads/");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory at:', uploadsDir);
}

console.log('📂 Uploads directory configured at:', uploadsDir);

/**
 * @swagger
 * /uploads/{filename}:
 *   get:
 *     tags: [Uploads]
 *     summary: Get uploaded file
 *     description: Retrieve an uploaded image or media file
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *           video/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "File not found"
 *       400:
 *         description: Invalid filename
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid filename"
 */
router.get("/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Basic filename validation
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }
    
    // Construct the full file path
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Check if it's actually a file (not a directory)
    if (!stats.isFile()) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    // Set appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream"; // default
    
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".mp4":
        contentType = "video/mp4";
        break;
      case ".webm":
        contentType = "video/webm";
        break;
      case ".mov":
        contentType = "video/quicktime";
        break;
    }
    
    // Set headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.setHeader("ETag", `"${stats.mtime.getTime()}-${stats.size}"`);
    
    // Handle conditional requests (304 Not Modified)
    const ifNoneMatch = req.headers["if-none-match"];
    const etag = `"${stats.mtime.getTime()}-${stats.size}"`;
    
    if (ifNoneMatch === etag) {
      return res.status(304).end();
    }
    
    // Create read stream and pipe to response
    const readStream = fs.createReadStream(filePath);
    
    readStream.on("error", (error) => {
      console.error("Error reading file:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error reading file"
        });
      }
    });
    
    readStream.pipe(res);
    
  } catch (error) {
    console.error("Uploads route error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/**
 * @swagger
 * /uploads/info/{filename}:
 *   get:
 *     tags: [Uploads]
 *     summary: Get file information
 *     description: Get metadata about an uploaded file
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "image-123456.jpg"
 *                     size:
 *                       type: number
 *                       example: 1024576
 *                     mimeType:
 *                       type: string
 *                       example: "image/jpeg"
 *                     lastModified:
 *                       type: string
 *                       format: date-time
 *                     url:
 *                       type: string
 *                       example: "/uploads/image-123456.jpg"
 *       404:
 *         description: File not found
 */
router.get("/info/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Basic filename validation
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }
    
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    // Get MIME type
    const ext = path.extname(filename).toLowerCase();
    let mimeType = "application/octet-stream";
    
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime"
    };
    
    if (mimeTypes[ext]) {
      mimeType = mimeTypes[ext];
    }
    
    res.json({
      success: true,
      data: {
        filename,
        size: stats.size,
        mimeType,
        lastModified: stats.mtime.toISOString(),
        url: `/uploads/${filename}`
      }
    });
    
  } catch (error) {
    console.error("File info error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;