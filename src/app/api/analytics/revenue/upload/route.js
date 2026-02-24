import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';
import Release from '@/models/Release';
import { parse } from 'papaparse';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const reportFile = formData.get('file');

    if (!reportFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await reportFile.text();
    const filename = reportFile.name;

    console.log(`[upload] Parsing CSV: ${filename} (${text.length} bytes)`);

    const { data, errors } = parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),
      transform: v => (typeof v === 'string' ? v.trim() : v)
    });

    console.log(`[upload] Parsed ${data.length} rows, ${errors.length} parse errors`);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in CSV', parseErrors: errors.slice(0, 5) },
        { status: 400 }
      );
    }

    // Build ISRC → releaseId map
    const releases = await Release.find({ isrc: { $exists: true, $ne: '' } })
      .select('_id isrc')
      .lean();
    const isrcToReleaseMap = {};
    releases.forEach(r => {
      if (r.isrc) isrcToReleaseMap[r.isrc.toUpperCase()] = r._id;
    });

    // Build all documents, compute rowHash
    const docs = [];
    const hashes = new Set();
    let skippedInvalid = 0;

    for (const row of data) {
      const isrc = row['ISRC'];
      const paymentDateStr = row['Payment Date'];

      if (!paymentDateStr || !isrc) { skippedInvalid++; continue; }

      const paymentDate = new Date(paymentDateStr);
      if (isNaN(paymentDate.getTime())) { skippedInvalid++; continue; }

      const store = row['Store'] || '';
      const storeService = row['Store service'] || '';
      const country = row['Country of sale or stream'] || '';
      const quantity = parseInt(row['Quantity of sales or streams'] || '0', 10) || 0;
      const grossEarnings = parseFloat(row['Gross earnings (USD)'] || '0') || 0;
      const netEarnings = parseFloat(row['Net earnings (USD)'] || '0') || 0;
      const sharePercentage = parseFloat(row['Share %'] || '100') || 100;

      const hashInput = [
        isrc, paymentDateStr, store, storeService, country,
        row['Start of reporting period'] || '',
        row['End of reporting period'] || '',
        quantity, netEarnings.toFixed(10)
      ].join('|');
      const rowHash = crypto.createHash('sha256').update(hashInput).digest('hex');

      if (hashes.has(rowHash)) { skippedInvalid++; continue; }
      hashes.add(rowHash);

      const startStr = row['Start of reporting period'];
      const endStr = row['End of reporting period'];

      docs.push({
        releaseId: isrcToReleaseMap[isrc.toUpperCase()] || null,
        isrc,
        paymentDate,
        ...(startStr ? { reportingPeriodStart: new Date(startStr) } : {}),
        ...(endStr ? { reportingPeriodEnd: new Date(endStr) } : {}),
        store,
        storeService,
        country,
        album: row['Album'] || '',
        upc: row['UPC'] || '',
        track: row['Track'] || '',
        primaryArtist: row['Primary artist(s)'] || '',
        quantity,
        grossEarnings,
        netEarnings,
        sharePercentage,
        rowHash,
        reportFile: filename,
        uploadDate: new Date(),
        createdAt: new Date()
      });
    }

    console.log(`[upload] Prepared ${docs.length} docs to insert (${skippedInvalid} skipped as invalid/dup)`);

    // Batch insert, ignore duplicate key errors for rowHash collisions
    let inserted = 0;
    let skippedDup = 0;

    // Process in chunks of 500 for safety
    const CHUNK = 500;
    for (let i = 0; i < docs.length; i += CHUNK) {
      const chunk = docs.slice(i, i + CHUNK);
      try {
        const result = await RevenueData.insertMany(chunk, { ordered: false });
        inserted += result.length;
      } catch (err) {
        if (err.code === 11000 || err.name === 'MongoBulkWriteError') {
          const insertedInBatch = err.result?.nInserted || err.insertedCount || 0;
          inserted += insertedInBatch;
          skippedDup += chunk.length - insertedInBatch;
        } else {
          throw err;
        }
      }
    }

    const skipped = skippedInvalid + skippedDup;
    console.log(`[upload] Done: ${inserted} inserted, ${skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: `Processed ${data.length} rows: ${inserted} inserted, ${skipped} skipped`,
      inserted,
      skipped,
      failed: 0,
      total: data.length
    });
  } catch (error) {
    console.error('[upload] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process revenue report', message: error.message },
      { status: 500 }
    );
  }
}