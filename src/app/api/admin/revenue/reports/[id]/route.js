import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';

// Simplified authentication - in a real app, implement proper auth checks
async function checkAdminPermission() {
  // For development, return true to allow access
  // In production, implement proper authentication
  return true;
}

export async function DELETE(request, { params }) {
  try {
    // Check admin authentication - simplified version
    const isAdmin = await checkAdminPermission();
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const { id } = params;
    
    // Get the filename using the ID (which is the filename)
    const report = await RevenueData.findOne({ reportFile: id });
    
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    // Delete all entries with matching reportFile
    const result = await RevenueData.deleteMany({ reportFile: id });
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} entries`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting revenue report:', error);
    return NextResponse.json(
      { error: 'Failed to delete revenue report', message: error.message },
      { status: 500 }
    );
  }
} 