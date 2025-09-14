import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    // Production configuration (using Gmail)
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development configuration (using Ethereal Email)
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
    });
  }
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: "Welcome to EvishJewellery - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EvishJewellery</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${data.name}!</h2>
            <p>Thank you for registering with EvishJewellery. To complete your registration and start shopping for beautiful jewelry, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationLink}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${data.verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EvishJewellery. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (data) => ({
    subject: "Password Reset - EvishJewellery",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EvishJewellery</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello ${data.name},</p>
            <p>We received a request to reset your password for your EvishJewellery account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetLink}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${data.resetLink}</p>
            <div class="warning">
              <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
            </div>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EvishJewellery. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; padding: 15px 0; border-top: 2px solid #d4af37; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EvishJewellery</h1>
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Thank you for your order! We're excited to prepare your beautiful jewelry for you.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(
                data.orderDate
              ).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${data.status}</p>
              
              <h4>Items Ordered:</h4>
              ${data.items
                .map(
                  (item) => `
                <div class="item">
                  <div>
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity}
                  </div>
                  <div>₹${item.total}</div>
                </div>
              `
                )
                .join("")}
              
              <div class="total">
                <div style="display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>₹${data.pricing.subtotal}</span>
                </div>
                ${
                  data.pricing.discount > 0
                    ? `
                  <div style="display: flex; justify-content: space-between;">
                    <span>Discount:</span>
                    <span>-₹${data.pricing.discount}</span>
                  </div>
                `
                    : ""
                }
                <div style="display: flex; justify-content: space-between;">
                  <span>Shipping:</span>
                  <span>₹${data.pricing.shipping}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Total:</span>
                  <span>₹${data.pricing.total}</span>
                </div>
              </div>
            </div>
            
            <p>We'll send you another email when your order ships with tracking information.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EvishJewellery. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderShipped: (data) => ({
    subject: `Your Order Has Shipped - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .tracking { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EvishJewellery</h1>
            <h2>Your Order Has Shipped!</h2>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="tracking">
              <h3>Tracking Information</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p><strong>Carrier:</strong> ${data.carrier}</p>
              ${
                data.trackingUrl
                  ? `
                <a href="${data.trackingUrl}" class="button">Track Your Package</a>
              `
                  : ""
              }
              <p><strong>Estimated Delivery:</strong> ${new Date(
                data.estimatedDelivery
              ).toLocaleDateString()}</p>
            </div>
            
            <p>You can track your package using the tracking number above or by clicking the tracking button.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EvishJewellery. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderDelivered: (data) => ({
    subject: `Order Delivered - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EvishJewellery</h1>
            <h2>Your Order Has Been Delivered!</h2>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Your order has been successfully delivered! We hope you love your new jewelry.</p>
            
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Delivered On:</strong> ${new Date(
              data.deliveredAt
            ).toLocaleDateString()}</p>
            
            <p>We'd love to hear about your experience! Please consider leaving a review for your purchase.</p>
            <a href="${data.reviewLink}" class="button">Leave a Review</a>
            
            <p>Thank you for choosing EvishJewellery. We look forward to serving you again!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 EvishJewellery. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
export const sendEmail = async ({
  to,
  subject,
  template,
  data,
  html,
  text,
}) => {
  try {
    const transporter = createTransporter();

    let emailContent;

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else if (html) {
      emailContent = { html };
    } else {
      emailContent = { text };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@evishjewellery.com",
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || text,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      console.log("Email sent:", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

// Send bulk emails
export const sendBulkEmails = async (emails) => {
  const results = [];

  for (const email of emails) {
    try {
      const result = await sendEmail(email);
      results.push({
        success: true,
        email: email.to,
        messageId: result.messageId,
      });
    } catch (error) {
      results.push({ success: false, email: email.to, error: error.message });
    }
  }

  return results;
};

// Send email with attachment
export const sendEmailWithAttachment = async ({
  to,
  subject,
  template,
  data,
  attachments,
}) => {
  try {
    const transporter = createTransporter();

    let emailContent;

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@evishjewellery.com",
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email with attachment sending failed:", error);
    throw error;
  }
};

export default { sendEmail, sendBulkEmails, sendEmailWithAttachment };
