const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['client', 'lawyer', 'student', 'admin'],
    default: 'client'
  },
  // User status
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Lawyer-specific fields
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not_requested'],
    default: 'not_requested'
  },
  specialization: {
    type: String,
    required: function() { return this.role === 'lawyer'; }
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'lawyer'; }
  },
  barCouncilNumber: {
    type: String,
    required: function() { return this.role === 'lawyer'; }
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  documents: [{
    documentType: String,
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Payment fields
  hasPaid: { 
    type: Boolean, 
    default: false 
  },
  paymentDate: { 
    type: Date 
  },
  razorpayPaymentId: {
    type: String
  },
  razorpayOrderId: {
    type: String
  },
  
  // Admin fields
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
 
  joinTeamStatus: {
    type: String,
    enum: ['not_requested', 'pending', 'approved', 'rejected', 'paid'],
    default: 'not_requested'
  },
  verificationRequestedAt: {
    type: Date
  },
  verificationDeadline: {
    type: Date
  },
  paymentDeadline: {
    type: Date
  },
  teamJoinFee: {
    type: Number,
    default: 2499 
  },
  teamJoinPaymentId: {
    type: String
  },
  teamJoinPaymentDate: {
    type: Date
  },

  // Session tracking
  sessionDuration: {
    type: Number,
    default: 0 // in minutes
  },
  lastSession: {
    type: Date
  }
}, {
  timestamps: true // ✅ MOVED TO SCHEMA OPTIONS (second parameter)
});

// Middleware to handle admin-specific defaults
UserSchema.pre('save', function(next) {
  // Admin users are always verified and active
  if (this.role === 'admin') {
    this.isVerified = true;
    this.isActive = true;
    this.hasPaid = true;
    this.verificationStatus = 'approved';
  }
  next();
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last active timestamp
UserSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);