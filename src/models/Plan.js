// src/models/Plan.js
import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the plan name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide the plan price'],
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    default: 'yearly',
  },
  features: [{
    type: String,
    required: [true, 'Please provide at least one feature'],
  }],
  highlighted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);