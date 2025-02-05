const otpGenerator = require("otp-generator");
const OTP = require("../Models/otp.Model");
const User = require('../Models/user.Model'); 
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

  
    const existingOTP = await OTP.findOne({ email });
    if (existingOTP) {
      const otpCreatedTime = new Date(existingOTP.createdAt);
      const currentTime = new Date();
      const timeDifference = (currentTime - otpCreatedTime) / (1000 * 60); 

      if (timeDifference < 1) { 
        return res.status(409).json({
          success: false,
          message: "An OTP has already been sent. Please wait before requesting another.",
        });
      }

    
      await OTP.deleteOne({ email });
    }

  
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

  
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error("Error in sendOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

  
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }


    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or expired' });
    }

 
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    const user = await User.findOneAndUpdate(
      { email },
      { verified: true }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

 
    await OTP.deleteOne({ email });

    res.status(200).json({ message: 'OTP verified successfully and user verified', user });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

   
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

