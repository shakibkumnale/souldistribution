import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RevenueData from '@/models/RevenueData';
import Release from '@/models/Release';
import Artist from '@/models/Artist';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'overview';
    const artistId = searchParams.get('artist');
    const isrc = searchParams.get('isrc');
    const releaseId = searchParams.get('release');
    const store = searchParams.get('store');
    const country = searchParams.get('country');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(200, parseInt(searchParams.get('limit') || '50', 10));
    const skip = (page - 1) * limit;

    // ─── VIEW: overview ──────────────────────────────────────────────────────
    if (view === 'overview') {
      const [summary, topStores, topCountries, monthlyTrend, artists] = await Promise.all([
        RevenueData.aggregate([
          { $group: { _id: null, totalNetEarnings: { $sum: '$netEarnings' }, totalGrossEarnings: { $sum: '$grossEarnings' }, totalQuantity: { $sum: '$quantity' } } }
        ]),
        RevenueData.aggregate([
          { $group: { _id: '$store', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' }, trackCount: { $addToSet: '$isrc' } } },
          { $project: { netEarnings: 1, quantity: 1, trackCount: { $size: '$trackCount' } } },
          { $sort: { netEarnings: -1 } },
          { $limit: 10 }
        ]),
        RevenueData.aggregate([
          { $group: { _id: '$country', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { netEarnings: -1 } },
          { $limit: 20 }
        ]),
        // Monthly trend — group by year+month of paymentDate
        RevenueData.aggregate([
          { $group: { _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } }, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
          { $limit: 24 }
        ]),
        Artist.find({}).select('name slug image').sort({ name: 1 }).lean()
      ]);

      return NextResponse.json({
        summary: summary[0] || { totalNetEarnings: 0, totalGrossEarnings: 0, totalQuantity: 0 },
        topStores,
        topCountries,
        monthlyTrend,
        artists
      });
    }

    // ─── VIEW: artists ────────────────────────────────────────────────────────
    if (view === 'artists') {
      const artistReleases = await Release.aggregate([
        { $match: { artists: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$artists' },
        { $group: { _id: '$artists', releaseIds: { $addToSet: '$_id' }, isrcList: { $addToSet: '$isrc' } } }
      ]);

      const artistReleaseMap = {};
      for (const ar of artistReleases) {
        artistReleaseMap[ar._id.toString()] = {
          releaseIds: ar.releaseIds,
          isrcList: ar.isrcList.filter(Boolean)
        };
      }

      const artistIds = artistReleases.map(ar => ar._id);
      const artists = await Artist.find({ _id: { $in: artistIds } }).select('name slug image').lean();

      const allReleaseIds = artistReleases.flatMap(ar => ar.releaseIds);
      const allIsrcs = artistReleases.flatMap(ar => ar.isrcList.filter(Boolean));

      const revenueAgg = await RevenueData.aggregate([
        { $match: { $or: [{ releaseId: { $in: allReleaseIds } }, { isrc: { $in: allIsrcs } }] } },
        { $group: { _id: { releaseId: '$releaseId', isrc: '$isrc', store: '$store' }, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } }
      ]);

      const revenueIndex = {};
      for (const row of revenueAgg) {
        const key = row._id.releaseId ? row._id.releaseId.toString() : `isrc:${row._id.isrc}`;
        if (!revenueIndex[key]) revenueIndex[key] = {};
        revenueIndex[key][row._id.store] = (revenueIndex[key][row._id.store] || 0) + row.netEarnings;
      }

      const allReleaseDocs = await Release.find({ _id: { $in: allReleaseIds } }).select('_id isrc').lean();
      const releaseIsrcMap = {};
      for (const r of allReleaseDocs) { if (r.isrc) releaseIsrcMap[r.isrc] = r._id.toString(); }

      const artistSummaries = artists.map(artist => {
        const info = artistReleaseMap[artist._id.toString()] || { releaseIds: [], isrcList: [] };
        const platformMap = {};
        let totalNetEarnings = 0;

        for (const rid of info.releaseIds) {
          const r = revenueIndex[rid.toString()];
          if (r) { for (const [s, amt] of Object.entries(r)) { platformMap[s] = (platformMap[s] || 0) + amt; totalNetEarnings += amt; } }
        }
        for (const isrcVal of info.isrcList) {
          const ridStr = releaseIsrcMap[isrcVal];
          if (!ridStr) {
            const r = revenueIndex[`isrc:${isrcVal}`];
            if (r) { for (const [s, amt] of Object.entries(r)) { platformMap[s] = (platformMap[s] || 0) + amt; totalNetEarnings += amt; } }
          }
        }

        const platformBreakdown = Object.entries(platformMap).map(([store, netEarnings]) => ({ store, netEarnings })).sort((a, b) => b.netEarnings - a.netEarnings);
        return { _id: artist._id, name: artist.name, slug: artist.slug, image: artist.image, totalNetEarnings, releaseCount: info.releaseIds.length, topPlatform: platformBreakdown[0]?.store || null, platformBreakdown };
      }).sort((a, b) => b.totalNetEarnings - a.totalNetEarnings);

      const total = artistSummaries.length;
      return NextResponse.json({ artists: artistSummaries.slice(skip, skip + limit), total, page, limit });
    }

    // ─── VIEW: releases (per artist) ─────────────────────────────────────────
    if (view === 'releases') {
      if (!artistId || !mongoose.Types.ObjectId.isValid(artistId)) return NextResponse.json({ error: 'Valid artist ID required' }, { status: 400 });

      const artistObjectId = new mongoose.Types.ObjectId(artistId);
      const releases = await Release.find({ artists: artistObjectId }).select('_id title slug isrc coverImage artists').populate('artists', 'name slug').lean();

      const releaseIds = releases.map(r => r._id);
      const isrcList = releases.map(r => r.isrc).filter(Boolean);
      const isrcToRelease = {};
      const idToRelease = {};
      for (const r of releases) { idToRelease[r._id.toString()] = r; if (r.isrc) isrcToRelease[r.isrc] = r; }

      const revenueRows = await RevenueData.aggregate([
        { $match: { $or: [{ releaseId: { $in: releaseIds } }, { isrc: { $in: isrcList } }] } },
        { $group: { _id: { releaseId: '$releaseId', isrc: '$isrc', store: '$store' }, netEarnings: { $sum: '$netEarnings' }, grossEarnings: { $sum: '$grossEarnings' }, quantity: { $sum: '$quantity' } } }
      ]);

      const releaseMap = {};
      for (const row of revenueRows) {
        let release = null, key = null;
        if (row._id.releaseId) { key = row._id.releaseId.toString(); release = idToRelease[key]; }
        if (!release && row._id.isrc) { key = `isrc:${row._id.isrc}`; release = isrcToRelease[row._id.isrc]; }
        if (!key) continue;

        if (!releaseMap[key]) {
          releaseMap[key] = { _id: release?._id || null, title: release?.title || row._id.isrc || 'Unknown', slug: release?.slug || '', isrc: release?.isrc || row._id.isrc || '', coverImage: release?.coverImage || '', artists: release?.artists || [], totalNetEarnings: 0, totalGrossEarnings: 0, totalQuantity: 0, platformBreakdown: {} };
        }
        const e = releaseMap[key];
        e.totalNetEarnings += row.netEarnings; e.totalGrossEarnings += row.grossEarnings; e.totalQuantity += row.quantity;
        e.platformBreakdown[row._id.store] = (e.platformBreakdown[row._id.store] || 0) + row.netEarnings;
      }

      const releaseSummaries = Object.values(releaseMap).map(r => ({ ...r, platformBreakdown: Object.entries(r.platformBreakdown).map(([store, netEarnings]) => ({ store, netEarnings })).sort((a, b) => b.netEarnings - a.netEarnings) })).sort((a, b) => b.totalNetEarnings - a.totalNetEarnings);

      const artist = await Artist.findById(artistId).select('name slug image').lean();
      return NextResponse.json({ releases: releaseSummaries.slice(skip, skip + limit), total: releaseSummaries.length, page, limit, artist });
    }

    // ─── VIEW: stores ─────────────────────────────────────────────────────────
    if (view === 'stores') {
      const stores = await RevenueData.aggregate([
        { $group: { _id: '$store', netEarnings: { $sum: '$netEarnings' }, grossEarnings: { $sum: '$grossEarnings' }, quantity: { $sum: '$quantity' }, trackCount: { $addToSet: '$isrc' }, countryCount: { $addToSet: '$country' } } },
        { $project: { netEarnings: 1, grossEarnings: 1, quantity: 1, trackCount: { $size: '$trackCount' }, countryCount: { $size: '$countryCount' } } },
        { $sort: { netEarnings: -1 } }
      ]);
      return NextResponse.json({ stores });
    }

    // ─── VIEW: store-detail ───────────────────────────────────────────────────
    if (view === 'store-detail') {
      if (!store) return NextResponse.json({ error: 'store param required' }, { status: 400 });
      const [topTracks, topCountries, storeSummary] = await Promise.all([
        RevenueData.aggregate([
          { $match: { store } },
          { $group: { _id: { isrc: '$isrc', track: '$track' }, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { netEarnings: -1 } },
          { $limit: 20 }
        ]),
        RevenueData.aggregate([
          { $match: { store } },
          { $group: { _id: '$country', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { netEarnings: -1 } },
          { $limit: 20 }
        ]),
        RevenueData.aggregate([
          { $match: { store } },
          { $group: { _id: null, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } }
        ])
      ]);

      // Enrich tracks with release info
      const isrcs = topTracks.map(t => t._id.isrc).filter(Boolean);
      const releaseInfoMap = {};
      if (isrcs.length) {
        const rels = await Release.find({ isrc: { $in: isrcs } }).select('title isrc coverImage artists').populate('artists', 'name').lean();
        rels.forEach(r => { releaseInfoMap[r.isrc] = r; });
      }

      const enrichedTracks = topTracks.map(t => ({ isrc: t._id.isrc, track: t._id.track, netEarnings: t.netEarnings, quantity: t.quantity, release: releaseInfoMap[t._id.isrc] || null }));

      return NextResponse.json({ store, summary: storeSummary[0] || {}, topTracks: enrichedTracks, topCountries });
    }

    // ─── VIEW: countries ──────────────────────────────────────────────────────
    if (view === 'countries') {
      const countries = await RevenueData.aggregate([
        { $group: { _id: '$country', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' }, storeCount: { $addToSet: '$store' }, trackCount: { $addToSet: '$isrc' } } },
        { $project: { netEarnings: 1, quantity: 1, storeCount: { $size: '$storeCount' }, trackCount: { $size: '$trackCount' } } },
        { $sort: { netEarnings: -1 } },
        { $limit: 50 }
      ]);
      return NextResponse.json({ countries });
    }

    // ─── VIEW: country-detail ─────────────────────────────────────────────────
    if (view === 'country-detail') {
      if (!country) return NextResponse.json({ error: 'country param required' }, { status: 400 });
      const [topTracks, storeBreakdown, countrySummary] = await Promise.all([
        RevenueData.aggregate([
          { $match: { country } },
          { $group: { _id: { isrc: '$isrc', track: '$track' }, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { netEarnings: -1 } },
          { $limit: 20 }
        ]),
        RevenueData.aggregate([
          { $match: { country } },
          { $group: { _id: '$store', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } },
          { $sort: { netEarnings: -1 } }
        ]),
        RevenueData.aggregate([
          { $match: { country } },
          { $group: { _id: null, netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } }
        ])
      ]);

      const isrcs = topTracks.map(t => t._id.isrc).filter(Boolean);
      const releaseInfoMap = {};
      if (isrcs.length) {
        const rels = await Release.find({ isrc: { $in: isrcs } }).select('title isrc coverImage artists').populate('artists', 'name').lean();
        rels.forEach(r => { releaseInfoMap[r.isrc] = r; });
      }

      const enrichedTracks = topTracks.map(t => ({ isrc: t._id.isrc, track: t._id.track, netEarnings: t.netEarnings, quantity: t.quantity, release: releaseInfoMap[t._id.isrc] || null }));

      return NextResponse.json({ country, summary: countrySummary[0] || {}, topTracks: enrichedTracks, storeBreakdown });
    }

    // ─── VIEW: tracks ─────────────────────────────────────────────────────────
    if (view === 'tracks') {
      const search = searchParams.get('q') || '';
      const matchQuery = search ? { track: { $regex: search, $options: 'i' } } : {};

      const [tracks, total] = await Promise.all([
        RevenueData.aggregate([
          { $match: matchQuery },
          { $group: { _id: { isrc: '$isrc', track: '$track' }, netEarnings: { $sum: '$netEarnings' }, grossEarnings: { $sum: '$grossEarnings' }, quantity: { $sum: '$quantity' }, stores: { $addToSet: '$store' } } },
          { $sort: { netEarnings: -1 } },
          { $skip: skip },
          { $limit: limit }
        ]),
        RevenueData.aggregate([
          { $match: matchQuery },
          { $group: { _id: { isrc: '$isrc', track: '$track' } } },
          { $count: 'total' }
        ])
      ]);

      const isrcs = tracks.map(t => t._id.isrc).filter(Boolean);
      const releaseInfoMap = {};
      if (isrcs.length) {
        const rels = await Release.find({ isrc: { $in: isrcs } }).select('title isrc coverImage artists').populate('artists', 'name').lean();
        rels.forEach(r => { releaseInfoMap[r.isrc] = r; });
      }

      const enriched = tracks.map(t => ({ isrc: t._id.isrc, track: t._id.track, netEarnings: t.netEarnings, quantity: t.quantity, stores: t.stores, release: releaseInfoMap[t._id.isrc] || null }));

      return NextResponse.json({ tracks: enriched, total: total[0]?.total || 0, page, limit });
    }

    // ─── VIEW: detail (raw paginated rows) ────────────────────────────────────
    if (view === 'detail') {
      const query = {};
      if (isrc) {
        const rel = await Release.findOne({ isrc }).select('_id').lean();
        query.$or = rel ? [{ releaseId: rel._id }, { isrc }] : [{ isrc }];
      } else if (releaseId && mongoose.Types.ObjectId.isValid(releaseId)) {
        const rel = await Release.findById(releaseId).select('_id isrc').lean();
        query.$or = rel ? [{ releaseId: rel._id }, ...(rel.isrc ? [{ isrc: rel.isrc }] : [])] : [{ releaseId: new mongoose.Types.ObjectId(releaseId) }];
      }
      if (store) query.store = store;
      if (country) query.country = country;

      const [rows, total, platformBreakdown, countryBreakdown, summary] = await Promise.all([
        RevenueData.find(query).sort({ paymentDate: -1 }).skip(skip).limit(limit).lean(),
        RevenueData.countDocuments(query),
        RevenueData.aggregate([{ $match: query }, { $group: { _id: '$store', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } }, { $sort: { netEarnings: -1 } }]),
        RevenueData.aggregate([{ $match: query }, { $group: { _id: '$country', netEarnings: { $sum: '$netEarnings' }, quantity: { $sum: '$quantity' } } }, { $sort: { netEarnings: -1 } }, { $limit: 15 }]),
        RevenueData.aggregate([{ $match: query }, { $group: { _id: null, totalNetEarnings: { $sum: '$netEarnings' }, totalGrossEarnings: { $sum: '$grossEarnings' }, totalQuantity: { $sum: '$quantity' } } }])
      ]);

      let releaseInfo = null;
      if (isrc) releaseInfo = await Release.findOne({ isrc }).select('title slug coverImage artists isrc').populate('artists', 'name slug image').lean();
      else if (releaseId && mongoose.Types.ObjectId.isValid(releaseId)) releaseInfo = await Release.findById(releaseId).select('title slug coverImage artists isrc').populate('artists', 'name slug image').lean();

      return NextResponse.json({ rows, total, page, limit, summary: summary[0] || {}, platformBreakdown, countryBreakdown, release: releaseInfo });
    }

    return NextResponse.json({ error: 'Unknown view' }, { status: 400 });
  } catch (error) {
    console.error('[revenue GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data', message: error.message }, { status: 500 });
  }
}