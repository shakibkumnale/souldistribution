import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';
import Release from '@/models/Release';
import Artist from '@/models/Artist';
import mongoose from 'mongoose';

/**
 * GET /api/analytics/revenue
 * Get revenue analytics data with various filters
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const release = searchParams.get('release');
    const artist = searchParams.get('artist');
    const store = searchParams.get('store');
    const country = searchParams.get('country');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const track = searchParams.get('track');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    // Build base query
    const query = {};
    
    // Filter by release if provided
    if (release && mongoose.Types.ObjectId.isValid(release)) {
      query.releaseId = new mongoose.Types.ObjectId(release);
    }
    
    // Filter by track ID, slug, or ISRC
    if (track) {
      // First try to find the release by ID, slug, or ISRC
      let trackRelease;
      
      if (mongoose.Types.ObjectId.isValid(track)) {
        trackRelease = await Release.findById(track).select('_id isrc').lean();
      }
      
      if (!trackRelease) {
        trackRelease = await Release.findOne({ 
          $or: [
            { slug: track },
            { isrc: track }
          ]
        }).select('_id isrc').lean();
      }
      
      if (trackRelease) {
        query.$or = [
          { releaseId: trackRelease._id }
        ];
        
        if (trackRelease.isrc) {
          query.$or.push({ isrc: trackRelease.isrc });
        }
      } else {
        // If we can't find a release, try direct ISRC match
        query.isrc = track;
      }
    }
    
    // Filter by artist - need to find all releases by this artist first
    if (artist && mongoose.Types.ObjectId.isValid(artist)) {
      const artistReleases = await Release.find({
        artists: new mongoose.Types.ObjectId(artist)
      }).select('_id isrc').lean();
      
      // We need to match either by releaseId or by ISRC
      const releaseIds = artistReleases.map(r => r._id);
      const isrcCodes = artistReleases.map(r => r.isrc).filter(Boolean);
      
      if (releaseIds.length > 0 || isrcCodes.length > 0) {
        query.$or = [];
        
        if (releaseIds.length > 0) {
          query.$or.push({ releaseId: { $in: releaseIds } });
        }
        
        if (isrcCodes.length > 0) {
          query.$or.push({ isrc: { $in: isrcCodes } });
        }
      } else {
        // If artist has no releases, return empty result
        return NextResponse.json({
          revenue: [],
          summary: {
            totalGrossEarnings: 0,
            totalNetEarnings: 0,
            totalQuantity: 0
          },
          topStores: [],
          topCountries: [],
          recentPayments: [],
          artists: [],
          currentArtist: null
        });
      }
    }
    
    // Apply store filter
    if (store) {
      query.store = store;
    }
    
    // Apply country filter
    if (country) {
      query.country = country;
    }
    
    // Apply date filters
    if (fromDate || toDate) {
      query.paymentDate = {};
      if (fromDate) query.paymentDate.$gte = new Date(fromDate);
      if (toDate) query.paymentDate.$lte = new Date(toDate);
    }
    
    // Get revenue entries with basic aggregation
    const revenueData = await RevenueData.find(query)
      .sort({ paymentDate: -1 })
      .limit(limit)
      .lean();
    
    // Get summary metrics
    const summary = await RevenueData.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalGrossEarnings: { $sum: '$grossEarnings' },
          totalNetEarnings: { $sum: '$netEarnings' },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);
    
    // Get top stores by earnings
    const topStores = await RevenueData.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$store',
          netEarnings: { $sum: '$netEarnings' },
          quantity: { $sum: '$quantity' }
        }
      },
      { $sort: { netEarnings: -1 } },
      { $limit: 10 }
    ]);
    
    // Get top countries by earnings
    const topCountries = await RevenueData.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$country',
          netEarnings: { $sum: '$netEarnings' },
          quantity: { $sum: '$quantity' }
        }
      },
      { $sort: { netEarnings: -1 } },
      { $limit: 10 }
    ]);
    
    // Get unique payment dates (for filtering)
    const recentPayments = await RevenueData.aggregate([
      { $sort: { paymentDate: -1 } },
      {
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } }
        }
      },
      { $limit: 10 },
      { $sort: { _id: -1 } }
    ]);
    
    // Process revenue data to include release and artist info
    const processedRevenueData = await Promise.all(
      revenueData.map(async (entry) => {
        let releaseInfo = null;
        
        // Try to find the release, either by releaseId or ISRC
        if (entry.releaseId) {
          releaseInfo = await Release.findById(entry.releaseId)
            .select('title slug coverImage artists')
            .populate('artists', 'name slug')
            .lean();
        } else if (entry.isrc) {
          releaseInfo = await Release.findOne({ isrc: entry.isrc })
            .select('title slug coverImage artists')
            .populate('artists', 'name slug')
            .lean();
        }
        
        return {
          ...entry,
          release: releaseInfo || {
            title: entry.track || 'Unknown Track',
            slug: '',
            coverImage: '',
            artists: []
          }
        };
      })
    );
    
    // Get all artists who have releases with revenue data
    const artistsWithData = await Artist.aggregate([
      { 
        $lookup: {
          from: 'releases',
          localField: '_id',
          foreignField: 'artists',
          as: 'releases'
        }
      },
      // Project out the ISRC codes from releases
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          image: 1,
          releases: 1,
          isrcCodes: '$releases.isrc'
        }
      },
      // Only include artists with releases
      {
        $match: {
          'releases': { $ne: [] }
        }
      },
      { $sort: { name: 1 } }
    ]);
    
    // Get current artist details if filtered by artist
    let currentArtist = null;
    if (artist && mongoose.Types.ObjectId.isValid(artist)) {
      currentArtist = await Artist.findById(artist).select('name slug image').lean();
    }
    
    return NextResponse.json({
      revenue: processedRevenueData,
      summary: summary.length > 0 ? summary[0] : {
        totalGrossEarnings: 0,
        totalNetEarnings: 0,
        totalQuantity: 0
      },
      topStores,
      topCountries,
      recentPayments: recentPayments.map(r => r._id),
      artists: artistsWithData,
      currentArtist
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics data', message: error.message },
      { status: 500 }
    );
  }
} 