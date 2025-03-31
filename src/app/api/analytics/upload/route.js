import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Release from '@/models/Release';
import StreamData from '@/models/StreamData';
import { parse } from 'csv-parse/sync';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

/**
 * POST /api/analytics/upload
 * Upload and process LANDR streaming data
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    // Extract data from the request
    const data = await request.formData();
    const file = data.get('file');
    const reportDate = data.get('reportDate');
    
    if (!file || !reportDate) {
      return NextResponse.json(
        { error: 'Missing required fields (file or reportDate)' },
        { status: 400 }
      );
    }

    // Read file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileContent = fileBuffer.toString();
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Get all releases with landrTrackId set
    const releases = await Release.find({ 
      landrTrackId: { $exists: true, $ne: '' } 
    }).lean();

    console.log(`Found ${releases.length} releases with landrTrackId`);
    
    // Debug the first few to verify data
    if (releases.length > 0) {
      releases.slice(0, 3).forEach(release => {
        console.log(`Release "${release.title}" has landrTrackId: ${release.landrTrackId}`);
      });
    }

    // Create a map of landrTrackId to release
    const releaseMap = {};
    releases.forEach(release => {
      if (release.landrTrackId) {
        releaseMap[release.landrTrackId] = release;
      }
    });

    console.log(`Created releaseMap with ${Object.keys(releaseMap).length} entries`);

    // Log some of the IDs from the LANDR file to debug matching
    if (records.length > 0) {
      console.log("First few LANDR track IDs from CSV:");
      records.slice(0, 5).forEach(record => {
        const landrId = record.Id?.trim();
        const name = record.Name;
        const matchedRelease = releaseMap[landrId];
        console.log(`ID: ${landrId}, Name: ${name}, Matched: ${matchedRelease ? 'YES' : 'NO'}`);
      });
    }

    // Records to save
    const streamDataRecords = [];
    const date = new Date(reportDate);
    const reportFileName = file.name;

    // Process each record from the CSV
    for (const record of records) {
      // Extract and clean ID value
      const landrTrackId = record.Id?.trim();
      if (!landrTrackId) continue;

      // Find the matching release
      const release = releaseMap[landrTrackId];
      if (!release) continue;

      // Parse streaming data
      // LANDR provides lifetime totals, so we store them directly
      const streamData = {
        releaseId: release._id,
        landrTrackId,
        date,
        name: record.Name || '',
        streams: {
          count: parseInt(record['# Streams'] || 0, 10),
          percentage: parseFloat(record['Streams %'] || 0),
          change: parseInt(record['# Streams change'] || 0, 10),
          changePercentage: parseFloat(record['Streams change %'] || 0),
        },
        downloads: {
          count: parseInt(record['# Downloads'] || 0, 10),
          percentage: parseFloat(record['Downloads %'] || 0),
          change: parseInt(record['# Downloads change'] || 0, 10),
          changePercentage: parseFloat(record['Downloads change %'] || 0),
        },
        reportFile: reportFileName,
      };

      streamDataRecords.push(streamData);
    }

    // Insert all records at once
    if (streamDataRecords.length > 0) {
      await StreamData.insertMany(streamDataRecords);
    }

    return NextResponse.json({
      message: 'LANDR stream data processed successfully',
      recordsProcessed: streamDataRecords.length,
      totalRecords: records.length,
    });
  } catch (error) {
    console.error('Error processing stream data:', error);
    return NextResponse.json(
      { error: 'Failed to process stream data', message: error.message },
      { status: 500 }
    );
  }
} 