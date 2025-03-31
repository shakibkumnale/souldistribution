import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StreamData from '@/models/StreamData';
import Release from '@/models/Release';
import mongoose from 'mongoose';

/**
 * GET /api/analytics/release/[id]
 * Get detailed analytics for a specific release
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid release ID format' },
        { status: 400 }
      );
    }
    
    // Get release details
    const release = await Release.findById(id)
      .populate('artists', 'name slug spotifyArtistId')
      .lean();
    
    if (!release) {
      return NextResponse.json(
        { error: 'Release not found' },
        { status: 404 }
      );
    }
    
    // Get all stream data ordered by date
    const streamData = await StreamData.find({
      releaseId: id
    }).sort({ date: -1 }).lean();
    
    // Get the latest streams count instead of summing
    // since LANDR reports lifetime totals
    const totalStreams = streamData.length > 0 ? streamData[0].streams.count : 0;
    const totalDownloads = streamData.length > 0 ? streamData[0].downloads.count : 0;
    
    // Get stream data by date for charting
    const chartData = streamData.map(item => ({
      date: item.date,
      streams: item.streams.count || 0,
      downloads: item.downloads.count || 0,
    })).reverse(); // Reverse to get chronological order
    
    // Get the latest record
    const latestData = streamData.length > 0 ? streamData[0] : null;
    
    return NextResponse.json({
      release: {
        ...release,
        _id: release._id.toString(),
        artists: release.artists.map(a => ({
          ...a,
          _id: a._id.toString()
        }))
      },
      analytics: {
        totalStreams,
        totalDownloads,
        latestData: latestData ? {
          date: latestData.date,
          streams: latestData.streams,
          downloads: latestData.downloads
        } : null,
        streamHistory: chartData
      }
    });
  } catch (error) {
    console.error('Error fetching release analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch release analytics', message: error.message },
      { status: 500 }
    );
  }
} 