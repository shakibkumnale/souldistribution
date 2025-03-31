import mongoose from 'mongoose';

const StreamDataSchema = new mongoose.Schema({
  releaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Release',
    required: true,
  },
  landrTrackId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  name: String,
  streams: {
    count: Number,
    percentage: Number,
    change: Number,
    changePercentage: Number,
  },
  downloads: {
    count: Number,
    percentage: Number,
    change: Number,
    changePercentage: Number,
  },
  reportFile: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for faster lookups
StreamDataSchema.index({ releaseId: 1, date: 1 });
StreamDataSchema.index({ landrTrackId: 1, date: 1 });

export default mongoose.models.StreamData || mongoose.model('StreamData', StreamDataSchema); 