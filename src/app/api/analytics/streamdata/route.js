import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StreamData from '@/models/StreamData';

/**
 * DELETE /api/analytics/streamdata
 * Removes ALL records from the streamdatas collection.
 */
export async function DELETE() {
    try {
        await connectToDatabase();
        const result = await StreamData.deleteMany({});
        return NextResponse.json({
            message: `Deleted ${result.deletedCount} stream data record(s).`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting stream data:', error);
        return NextResponse.json(
            { error: 'Failed to delete stream data', message: error.message },
            { status: 500 }
        );
    }
}

/**
 * GET /api/analytics/streamdata
 * Returns total count of stream data records.
 */
export async function GET() {
    try {
        await connectToDatabase();
        const count = await StreamData.countDocuments();
        return NextResponse.json({ count });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch count', message: error.message },
            { status: 500 }
        );
    }
}
