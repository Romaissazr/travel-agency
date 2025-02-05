const Payment = require('../Models/payment.Model');
const Booking = require('../Models/booking.Model');

exports.createPayment = async (req, res) => {
  try {
    const { user, booking, amount, paymentMethod, transactionId } = req.body;

    const payment = new Payment({
      user,
      booking,
      amount,
      paymentMethod,
      transactionId,
      status: 'pending',
    });

    await payment.save();

    res.status(201).json({ success: true, message: 'Payment initiated', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

