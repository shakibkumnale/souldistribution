// src/models/Artist.js
import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the artist name'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'Please provide artist bio'],
  },
  image: {
    type: String,
    required: [true, 'Please provide artist image'],
  },
  spotifyUrl: String,
  spotifyArtistId: String,
  spotifyData: {
    followers: Number,
    genres: [String],
    popularity: Number,
    images: [{
      url: String,
      height: Number,
      width: Number
    }],
    external_urls: {
      spotify: String
    },
    uri: String
  },
  spotifyPlaylists: [{
    title: String,
    description: String,
    playlistId: String,
    coverImage: String
  }],
  youtubeUrl: String,
  youtubeChannelId: String,
  youtubeVideos: [{
    title: String,
    videoId: String,
    thumbnail: String
  }],
  instagramUrl: String,
  instagramId: String,
  instagramFollowers: Number,
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: true,
  },
  plans: [{
    type: {
      type: String,
      enum: ['basic', 'pro', 'premium', 'aoc'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    price: {
      type: Number,
      default: 0,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    transactionId: String,
  }],
  paymentHistory: [{
    plan: {
      type: String,
      enum: ['basic', 'pro', 'premium', 'aoc'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    transactionId: String,
    paymentMethod: String,
    billingDetails: {
      name: String,
      email: String,
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
ArtistSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Helper method to get active plans
ArtistSchema.methods.getActivePlans = function() {
  return this.plans.filter(plan => plan.status === 'active');
};

// Helper method to check if artist has a specific plan
ArtistSchema.methods.hasPlan = function(planType) {
  return this.plans.some(plan => plan.type === planType && plan.status === 'active');
};

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);

