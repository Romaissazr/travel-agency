const express = require('express');
const otpController = require('../Controllers/otp.Controller');
const router = express.Router();
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp', otpController.verifyOtp);
router.post("/verify-and-reset", otpController.verifyOtpAndResetPassword);

module.exports = router;