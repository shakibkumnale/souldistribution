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
 * Extract a Date from the filename (e.g. LANDR_TrendsBreakdown_20260221104312.csv)
 * Pattern: YYYYMMDD at any position of 14-digit timestamp
 */
function extractDateFromFilename(filename) {
  // Try to match YYYYMMDD (first 8 digits of a 14-digit timestamp block)
  const match = filename.match(/(\d{8})\d{6}/);
  if (match) {
    const raw = match[1]; // e.g. "20260221"
    const year = parseInt(raw.slice(0, 4), 10);
    const month = parseInt(raw.slice(4, 6), 10) - 1; // 0-indexed
    const day = parseInt(raw.slice(6, 8), 10);
    const d = new Date(Date.UTC(year, month, day));
    if (!isNaN(d.getTime())) return d;
  }
  return new Date(); // fallback: today
}

/**
 * POST /api/analytics/upload
 * Upload and process a LANDR Trends Breakdown CSV → StreamData collection
 * Body (multipart): file (.csv), optional reportDate (YYYY-MM-DD)
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine report date: use provided value or extract from filename
    const reportDateRaw = data.get('reportDate');
    let date;
    if (reportDateRaw) {
      date = new Date(reportDateRaw);
      if (isNaN(date.getTime())) date = extractDateFromFilename(file.name);
    } else {
      date = extractDateFromFilename(file.name);
    }

    // Read and parse CSV
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileContent = fileBuffer.toString();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Load all releases that have a landrTrackId
    const releases = await Release.find({
      landrTrackId: { $exists: true, $ne: '' },
    }).lean();

    const releaseMap = {};
    releases.forEach((r) => {
      if (r.landrTrackId) releaseMap[r.landrTrackId] = r;
    });

    const reportFileName = file.name;

    // Find existing records for same date to support dedup
    const existingTrackIds = new Set();
    const existingDocs = await StreamData.find({ date }).select('landrTrackId').lean();
    existingDocs.forEach((d) => existingTrackIds.add(d.landrTrackId));

    const toInsert = [];
    let skipped = 0;
    let unmatched = 0;

    for (const record of records) {
      const landrTrackId = record.Id?.trim();
      if (!landrTrackId) { skipped++; continue; }

      // Skip if same track already recorded for this date
      if (existingTrackIds.has(landrTrackId)) { skipped++; continue; }

      const release = releaseMap[landrTrackId];
      if (!release) { unmatched++; continue; }

      toInsert.push({
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
      });
    }

    if (toInsert.length > 0) {
      await StreamData.insertMany(toInsert);
    }

    return NextResponse.json({
      message: 'Stream data processed successfully',
      inserted: toInsert.length,
      skipped,
      unmatched,
      reportDate: date.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error processing stream data:', error);
    return NextResponse.json(
      { error: 'Failed to process stream data', message: error.message },
      { status: 500 }
    );
  }
}