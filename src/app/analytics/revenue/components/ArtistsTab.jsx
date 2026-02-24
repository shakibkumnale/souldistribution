'use client';
import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Disc3, Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber, getPlatformColor, PlatformBadge, PlatformBar, BackButton, Skeleton, TrackRow } from './shared';

// ── Artist Cards ─────────────────────────────

function ArtistCard({ artist, rank, onClick }) {
    return (
        <button onClick={onClick}
            className="text-left bg-gray-900/80 border border-gray-800 rounded-xl p-5 hover:border-purple-600/60 hover:bg-gray-900 transition-all group w-full">
            <div className="flex items-center gap-3 mb-4">
                {artist.image
                    ? <img src={artist.image} alt={artist.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-purple-600 transition-all" />
                    : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-lg font-bold text-white">{artist.name?.[0]}</div>}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-100 truncate group-hover:text-purple-300 transition-colors">{artist.name}</p>
                    <p className="text-xs text-gray-500">{artist.releaseCount} release{artist.releaseCount !== 1 ? 's' : ''}</p>
                </div>
                {rank < 4 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300">#{rank}</span>}
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-1">{formatCurrency(artist.totalNetEarnings)}</p>
            <p className="text-xs text-gray-500 mb-3">lifetime net earnings</p>
            {artist.topPlatform && <PlatformBadge store={artist.topPlatform} />}
            <PlatformBar platformBreakdown={artist.platformBreakdown} total={artist.totalNetEarnings} />
        </button>
    );
}

// ── Artist Detail (releases list) ────────────

function ArtistDetail({ artist, onBack, onSelectRelease }) {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const LIMIT = 15;

    const load = useCallback(async (pg, append) => {
        if (pg === 1) setLoading(true); else setLoadingMore(true);
        const res = await fetch(`/api/analytics/revenue?view=releases&artist=${artist._id}&page=${pg}&limit=${LIMIT}`);
        const d = await res.json();
        const list = d.releases || [];
        if (append) setReleases(prev => [...prev, ...list]); else setReleases(list);
        setHasMore(list.length === LIMIT);
        if (pg === 1) setLoading(false); else setLoadingMore(false);
    }, [artist._id]);

    useEffect(() => { load(1, false); }, [load]);

    const platformTotals = {};
    releases.forEach(r => r.platformBreakdown?.forEach(({ store, netEarnings }) => { platformTotals[store] = (platformTotals[store] || 0) + netEarnings; }));
    const pieData = Object.entries(platformTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

    return (
        <div>
            <BackButton onClick={onBack} label="All Artists" />
            <div className="flex items-center gap-4 mb-6 p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
                {artist.image
                    ? <img src={artist.image} alt={artist.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-600" />
                    : <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center text-2xl font-bold text-white">{artist.name?.[0]}</div>}
                <div>
                    <h2 className="text-2xl font-bold text-white">{artist.name}</h2>
                    <p className="text-purple-400 font-semibold">{formatCurrency(artist.totalNetEarnings)} <span className="text-gray-500 font-normal text-sm">lifetime</span></p>
                </div>
            </div>

            {loading ? <div className="flex justify-center h-40 items-center"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div> : (
                <>
                    {pieData.length > 0 && (
                        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 mb-6">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Revenue by Platform</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={80} label={false}>
                                            {pieData.map(e => <Cell key={e.name} fill={getPlatformColor(e.name)} />)}
                                        </Pie>
                                        <Tooltip content={({ active, payload }) => active && payload?.[0] ? <div className="bg-gray-800 border border-gray-700 rounded p-2 text-xs"><p style={{ color: getPlatformColor(payload[0].name) }}>{payload[0].name}</p><p className="text-white font-bold">{formatCurrency(payload[0].value)}</p></div> : null} />
                                        <Legend layout="vertical" align="right" verticalAlign="middle" formatter={v => <span className="text-xs text-gray-300">{v}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-300">Releases — 1 row per track (ISRC)</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-800"><th className="px-4 py-2 text-gray-400 font-medium text-left">Track</th><th className="px-4 py-2 text-gray-400 text-right">Earnings</th><th className="px-4 py-2 text-gray-400 text-right hidden sm:table-cell">Streams</th><th className="px-4 py-2 text-gray-400 hidden lg:table-cell">Platforms</th></tr></thead>
                            <tbody>
                                {releases.map((r, i) => (
                                    <tr key={r._id || r.isrc || i} className="border-b border-gray-800/40 hover:bg-gray-800/30 cursor-pointer" onClick={() => onSelectRelease(r, artist)}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {r.coverImage ? <img src={r.coverImage} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" /> : <div className="w-9 h-9 rounded bg-gray-800 flex items-center justify-center flex-shrink-0"><Disc3 className="w-4 h-4 text-gray-600" /></div>}
                                                <div className="min-w-0">
                                                    <p className="text-gray-200 font-medium truncate">{r.title}</p>
                                                    {r.isrc && <p className="font-mono text-xs text-gray-600">{r.isrc}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-purple-400">{formatCurrency(r.totalNetEarnings)}</td>
                                        <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{formatNumber(r.totalQuantity)}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">{r.platformBreakdown?.slice(0, 3).map(p => <PlatformBadge key={p.store} store={p.store} earnings={p.netEarnings} />)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {hasMore && (
                            <div className="flex justify-center p-4">
                                <button onClick={() => { const next = page + 1; setPage(next); load(next, true); }} disabled={loadingMore}
                                    className="text-sm text-gray-400 hover:text-purple-300 flex items-center gap-2">
                                    {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load More
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Main Artists Tab ─────────────────────────

export default function ArtistsTab({ onSelectRelease }) {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const LIMIT = 9;

    const load = useCallback(async (pg, append) => {
        if (pg === 1) setLoading(true); else setLoadingMore(true);
        const res = await fetch(`/api/analytics/revenue?view=artists&page=${pg}&limit=${LIMIT}`);
        const d = await res.json();
        const list = d.artists || [];
        if (append) setArtists(prev => [...prev, ...list]); else setArtists(list);
        setHasMore(list.length === LIMIT);
        if (pg === 1) setLoading(false); else setLoadingMore(false);
    }, []);

    useEffect(() => { load(1, false); }, [load]);

    if (selectedArtist) return <ArtistDetail artist={selectedArtist} onBack={() => setSelectedArtist(null)} onSelectRelease={onSelectRelease} />;

    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}</div>;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {artists.map((a, i) => <ArtistCard key={a._id} artist={a} rank={i + 1} onClick={() => setSelectedArtist(a)} />)}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <button onClick={() => { const next = page + 1; setPage(next); load(next, true); }} disabled={loadingMore}
                        className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-purple-600 hover:text-purple-300 text-sm flex items-center gap-2">
                        {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load More Artists
                    </button>
                </div>
            )}
        </div>
    );
}
