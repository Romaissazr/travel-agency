// models/otpModel.js
const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, 
    
  },
});


async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dddddd;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 20px 0;
          }
          .content p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
          }
          .otp-code {
            font-size: 28px;
            font-weight: bold;
            color: #6A669D;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #dddddd;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>OTP Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with us. Please use the following OTP to complete your verification:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for 5 minutes. If you did not request this OTP, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Tour Guid Rmss. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
 
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);