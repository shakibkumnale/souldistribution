import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';

// Simplified authentication - in a real app, implement proper auth checks
async function checkAdminPermission() {
  // For development, return true to allow access
  // In production, implement proper authentication
  return true;
}

export async function GET(request) {
  try {
    // Check admin authentication - simplified version
    const isAdmin = await checkAdminPermission();
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Aggregate reports by file name with entry counts
    const reports = await RevenueData.aggregate([
      { 
        $group: {
          _id: '$reportFile',
          filename: { $first: '$reportFile' },
          uploadDate: { $max: '$uploadDate' },
          entriesCount: { $sum: 1 },
          totalNetEarnings: { $sum: '$netEarnings' },
          totalGrossEarnings: { $sum: '$grossEarnings' },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { uploadDate: -1 } }
    ]);
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching revenue reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue reports', message: error.message },
      { status: 500 }
    );
  }
} 