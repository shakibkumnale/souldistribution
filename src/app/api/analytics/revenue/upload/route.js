import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';
import Release from '@/models/Release';
import { parse } from 'papaparse';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    // Get form data with the file
    const formData = await request.formData();
    const reportFile = formData.get('file');
    
    if (!reportFile) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Convert file to text
    const text = await reportFile.text();
    
    // Parse CSV data
    const { data, errors } = parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      transform: value => value.trim()
    });
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Error parsing CSV file', details: errors },
        { status: 400 }
      );
    }
    
    // Process data and save to database
    const results = [];
    const filename = reportFile.name;
    
    // First, get all releases with ISRC to match with report data
    const releases = await Release.find({ isrc: { $exists: true, $ne: '' } })
      .select('_id isrc')
      .lean();
    
    // Create a map of ISRC to release ID for quick lookups
    const isrcToReleaseMap = {};
    releases.forEach(release => {
      if (release.isrc) {
        isrcToReleaseMap[release.isrc] = release._id;
      }
    });
    
    for (const row of data) {
      try {
        // Skip rows without essential data
        if (!row['Payment Date'] || !row['ISRC']) {
          continue;
        }
        
        // Parse dates
        const paymentDate = new Date(row['Payment Date']);
        const reportingPeriodStart = new Date(row['Start of reporting period'] || row['Payment Date']);
        const reportingPeriodEnd = new Date(row['End of reporting period'] || row['Payment Date']);
        
        // Convert numeric fields
        const quantity = parseInt(row['Quantity of sales or streams'] || '0', 10);
        const grossEarnings = parseFloat(row['Gross earnings (USD)'] || '0');
        const netEarnings = parseFloat(row['Net earnings (USD)'] || '0');
        const sharePercentage = parseFloat(row['Share %'] || '100');
        
        // Create new revenue data entry
        const revenueEntry = new RevenueData({
          // If we have a matching release ID for this ISRC, include it
          releaseId: isrcToReleaseMap[row['ISRC']] || null,
          
          // Track identification
          isrc: row['ISRC'],
          
          // Payment details
          paymentDate,
          reportingPeriodStart,
          reportingPeriodEnd,
          
          // Store details
          store: row['Store'] || '',
          storeService: row['Store service'] || '',
          country: row['Country of sale or stream'] || '',
          
          // Track details
          album: row['Album'] || '',
          upc: row['UPC'] || '',
          track: row['Track'] || '',
          
          // Revenue data
          quantity,
          grossEarnings,
          netEarnings,
          sharePercentage,
          
          // Metadata
          reportFile: filename
        });
        
        await revenueEntry.save();
        results.push(revenueEntry);
      } catch (rowError) {
        console.error('Error processing row:', rowError, row);
        // Continue processing other rows even if one fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${results.length} revenue entries`,
      count: results.length
    });
  } catch (error) {
    console.error('Error uploading revenue report:', error);
    return NextResponse.json(
      { error: 'Failed to process revenue report', message: error.message },
      { status: 500 }
    );
  }
} 