import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/analytics/revenue/import
 * Accepts a MongoDB JSON export file (soul_clone.revenuedatas.json)
 * and imports the documents, skipping those that already exist by _id.
 */
export async function POST(request) {
    try {
        await connectToDatabase();

        const formData = await request.formData();
        const jsonFile = formData.get('file');

        if (!jsonFile) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const text = await jsonFile.text();
        console.log(`[import] Parsing JSON, size: ${text.length} bytes`);

        let rawDocs;
        try {
            rawDocs = JSON.parse(text);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON file', message: e.message }, { status: 400 });
        }

        if (!Array.isArray(rawDocs)) {
            return NextResponse.json({ error: 'JSON must be an array of documents' }, { status: 400 });
        }

        console.log(`[import] ${rawDocs.length} documents to import`);

        // Convert MongoDB extended JSON format to plain JS objects
        const convertDoc = (raw) => {
            const doc = {};

            for (const [key, val] of Object.entries(raw)) {
                if (key === '_id') {
                    // Convert $oid to ObjectId
                    doc._id = val?.$oid ? new mongoose.Types.ObjectId(val.$oid) : val;
                } else if (val && typeof val === 'object' && val.$oid) {
                    doc[key] = new mongoose.Types.ObjectId(val.$oid);
                } else if (val && typeof val === 'object' && val.$date) {
                    doc[key] = new Date(val.$date);
                } else if (val && typeof val === 'object' && val.$numberDecimal) {
                    doc[key] = parseFloat(val.$numberDecimal);
                } else {
                    doc[key] = val;
                }
            }

            return doc;
        };

        let inserted = 0;
        let skipped = 0;
        let failed = 0;

        // Process in chunks of 500
        const CHUNK = 500;
        for (let i = 0; i < rawDocs.length; i += CHUNK) {
            const chunk = rawDocs.slice(i, i + CHUNK).map(convertDoc);

            try {
                const result = await RevenueData.insertMany(chunk, {
                    ordered: false,
                    // Don't validate — old docs may not match current schema exactly
                });
                inserted += result.length;
            } catch (err) {
                if (err.code === 11000 || err.name === 'MongoBulkWriteError') {
                    // Some were duplicates, some may have been inserted
                    const ok = err.result?.nInserted ?? err.insertedCount ?? 0;
                    inserted += ok;
                    skipped += chunk.length - ok;
                } else {
                    console.error(`[import] Chunk ${i}–${i + CHUNK} error:`, err.message);
                    failed += chunk.length;
                }
            }

            if (i % 5000 === 0 && i > 0) {
                console.log(`[import] Progress: ${i}/${rawDocs.length}`);
            }
        }

        console.log(`[import] Done: ${inserted} inserted, ${skipped} skipped, ${failed} failed`);

        return NextResponse.json({
            success: true,
            message: `Imported ${rawDocs.length} docs: ${inserted} inserted, ${skipped} skipped (already exist), ${failed} failed`,
            inserted,
            skipped,
            failed,
            total: rawDocs.length
        });
    } catch (error) {
        console.error('[import] Error:', error);
        return NextResponse.json(
            { error: 'Import failed', message: error.message },
            { status: 500 }
        );
    }
}
