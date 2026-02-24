'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search } from 'lucide-react';
import { formatCurrency, formatNumber, Skeleton, PlatformBadge, TrackRow } from './shared';

export default function TracksTab({ onSelectTrack }) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 30;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, 350);
        return () => clearTimeout(t);
    }, [query]);

    const load = useCallback(async (pg, append) => {
        if (pg === 1) setLoading(true); else setLoadingMore(true);
        const params = new URLSearchParams({ view: 'tracks', page: pg, limit: LIMIT });
        if (debouncedQuery) params.set('q', debouncedQuery);
        const res = await fetch(`/api/analytics/revenue?${params}`);
        const d = await res.json();
        const list = d.tracks || [];
        setTotal(d.total || 0);
        if (append) setTracks(prev => [...prev, ...list]); else setTracks(list);
        if (pg === 1) setLoading(false); else setLoadingMore(false);
    }, [debouncedQuery]);

    useEffect(() => { load(1, false); }, [load]);

    return (
        <div>
            {/* Search */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search tracks..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-600 text-sm"
                />
            </div>

            {loading ? (
                <div className="space-y-1">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">All Tracks</h3>
                        <span className="text-xs text-gray-500">{total} total</span>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="px-4 py-2 text-gray-400 text-left w-8">#</th>
                                <th className="px-4 py-2 text-gray-400 text-left">Track</th>
                                <th className="px-4 py-2 text-gray-400 text-right">Earnings</th>
                                <th className="px-4 py-2 text-gray-400 text-right hidden sm:table-cell">Streams</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tracks.map((t, i) => (
                                <TrackRow
                                    key={t.isrc || i}
                                    track={t}
                                    rank={(page - 1) * LIMIT + i + 1}
                                    onClick={() => onSelectTrack({ isrc: t.isrc, title: t.track || t.isrc })}
                                />
                            ))}
                        </tbody>
                    </table>

                    {tracks.length < total && (
                        <div className="flex justify-center p-4">
                            <button
                                onClick={() => { const next = page + 1; setPage(next); load(next, true); }}
                                disabled={loadingMore}
                                className="text-sm text-gray-400 hover:text-purple-300 flex items-center gap-2"
                            >
                                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                                Load More ({tracks.length}/{total})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
