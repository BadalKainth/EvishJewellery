#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 EvishJewellery Backend Setup");
console.log("================================\n");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, "config", "env.example");

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log("📝 Creating .env file from template...");
    const envContent = fs.readFileSync(envExamplePath, "utf8");
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env file created successfully!");
    console.log(
      "⚠️  Please edit .env file with your configuration before starting the server.\n"
    );
  } else {
    console.log("❌ env.example file not found!");
  }
} else {
  console.log("✅ .env file already exists.\n");
}

// Check if uploads directories exist
const uploadsDir = path.join(__dirname, "uploads");
const productsDir = path.join(uploadsDir, "products");
const returnsDir = path.join(uploadsDir, "returns");

if (!fs.existsSync(uploadsDir)) {
  console.log("📁 Creating uploads directories...");
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ uploads directory created");
}

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log("✅ uploads/products directory created");
}

if (!fs.existsSync(returnsDir)) {
  fs.mkdirSync(returnsDir, { recursive: true });
  console.log("✅ uploads/returns directory created");
}

console.log("\n🎉 Setup completed successfully!");
console.log("\n📋 Next steps:");
console.log("1. Edit .env file with your configuration");
console.log("2. Make sure MongoDB is running");
console.log("3. Run: npm install");
console.log("4. Run: npm run dev");
console.log("\n📚 Check README.md for detailed documentation");
console.log("🔗 API will be available at: http://localhost:5000");
console.log("📊 Health check: http://localhost:5000/api/health\n");
