const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const User = require('../models/User'); // ADD THIS
const { protect } = require('../middleware/auth'); // ADD THIS

// Initialize Razorpay with test keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => { // ADD protect middleware
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment order' 
    });
  }
});

// Verify payment - UPDATED TO MARK USER AS PAID
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // MARK USER AS PAID
      await User.findByIdAndUpdate(req.user.id, {
        hasPaid: true,
        paymentDate: new Date()
      });

      console.log(`✅ User ${req.user.id} marked as paid`);

      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment verification failed' 
    });
  }
});

// NEW: Check payment status endpoint
router.get('/payment-status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      hasPaid: user.hasPaid || false,
      paymentDate: user.paymentDate
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check payment status' 
    });
  }
});

module.exports = router;