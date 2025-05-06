import mongoose from 'mongoose';

const RevenueDataSchema = new mongoose.Schema({
  // Track link between revenue data and release
  releaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Release',
    index: true
  },
  
  // Common identifier to link with releases
  isrc: {
    type: String,
    index: true
  },
  
  // Payment/reporting details
  paymentDate: {
    type: Date,
    required: true
  },
  reportingPeriodStart: {
    type: Date,
    required: true
  },
  reportingPeriodEnd: {
    type: Date,
    required: true
  },
  
  // Store details
  store: {
    type: String,
    required: true
  },
  storeService: String,
  country: String,
  
  // Track details
  album: String,
  upc: String,
  track: String,
  
  // Revenue & usage data
  quantity: {
    type: Number,
    default: 0
  },
  grossEarnings: {
    type: Number,
    default: 0
  },
  netEarnings: {
    type: Number,
    default: 0
  },
  sharePercentage: {
    type: Number,
    default: 100
  },
  
  // Metadata
  reportFile: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  
  // Utility fields
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Creating compound indexes for common queries
RevenueDataSchema.index({ isrc: 1, paymentDate: 1 });
RevenueDataSchema.index({ store: 1, country: 1 });
RevenueDataSchema.index({ reportingPeriodStart: 1, reportingPeriodEnd: 1 });

// Check if the model already exists to prevent overwrite during hot reloading
const RevenueData = mongoose.models.RevenueData || mongoose.model('RevenueData', RevenueDataSchema);

export default RevenueData; 