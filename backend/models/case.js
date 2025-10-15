const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  // Lawyer Information (for lawyer-created cases)
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Client Information (for lawyer-created cases)
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone: { type: String },
  clientAddress: { type: String },
  
  // Case Information
  caseName: { type: String, required: true },
  caseType: { type: String, required: true },
  caseNumber: { type: String },
  courtName: { type: String },
  filingDate: { type: Date },
  nextHearing: { type: Date },
  caseValue: { type: String },
  opponentName: { type: String },
  opponentLawyer: { type: String },
  description: { type: String },
  caseDescription: { type: String }, // For client-created cases
  
  // Lawyer Information (for client-created cases)
  lawyerName: { type: String },
  lawyerEmail: { type: String },
  lawyerPhone: { type: String },
  
  // Client reference (for client-created cases)
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Case Management
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['ongoing', 'solved'], default: 'ongoing' },
  documents: [{ type: String }],
  notes: { type: String, default: '' },

  // NEW: Payment Information
  paymentId: { 
    type: String, 
    default: null 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentAmount: { 
    type: Number, 
    default: 500 
  },
  razorpayOrderId: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

// Indexes for better performance
CaseSchema.index({ lawyer: 1, createdAt: -1 });
CaseSchema.index({ client: 1, createdAt: -1 });
CaseSchema.index({ status: 1 });
CaseSchema.index({ paymentStatus: 1 }); // NEW: Index for payment status

module.exports = mongoose.model('Case', CaseSchema);