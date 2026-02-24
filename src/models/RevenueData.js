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
    type: Date
  },
  reportingPeriodEnd: {
    type: Date
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

  // Primary artist from CSV (for unmatched tracks)
  primaryArtist: String,

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

  // Deduplication hash
  rowHash: {
    type: String
  },

  // Metadata
  reportFile: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for common queries
RevenueDataSchema.index({ isrc: 1, paymentDate: 1 });
RevenueDataSchema.index({ store: 1, country: 1 });
RevenueDataSchema.index({ country: 1 });
RevenueDataSchema.index({ store: 1 });
RevenueDataSchema.index({ paymentDate: 1 });
RevenueDataSchema.index({ rowHash: 1 }, { unique: true, sparse: true });
RevenueDataSchema.index({ releaseId: 1, store: 1 });
RevenueDataSchema.index({ track: 1, netEarnings: -1 });

const RevenueData = mongoose.models.RevenueData || mongoose.model('RevenueData', RevenueDataSchema);

export default RevenueData;