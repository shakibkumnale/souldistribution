'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber, getPlatformColor, CHART_COLORS, BackButton, CustomTooltip, TrackRow, PlatformBadge, Skeleton } from './shared';

function StoreCard({ store, onClick }) {
    const color = getPlatformColor(store._id);
    return (
        <button onClick={onClick}
            className="text-left bg-gray-900/80 border border-gray-800 rounded-xl p-5 hover:border-opacity-50 transition-all w-full group"
            style={{ '--tw-border-opacity': 1, borderColor: `${color}33` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div>
                    <p className="font-bold text-gray-100 group-hover:text-white transition-colors">{store._id}</p>
                    <p className="text-xs text-gray-500">{store.trackCount} tracks · {store.countryCount} countries</p>
                </div>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{formatCurrency(store.netEarnings)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatNumber(store.quantity)} streams/sales</p>
        </button>
    );
}

function StoreDetail({ store, onBack, onSelectTrack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/analytics/revenue?view=store-detail&store=${encodeURIComponent(store)}`)
            .then(r => r.json()).then(d => { setData(d); setLoading(false); });
    }, [store]);

    if (loading) return <div className="flex justify-center h-48 items-center"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>;

    const { summary = {}, topTracks = [], topCountries = [] } = data || {};
    const color = getPlatformColor(store);
    const barData = topTracks.slice(0, 12).map(t => ({ name: t.track || t.isrc || 'Unknown', value: t.netEarnings }));

    return (
        <div>
            <BackButton onClick={onBack} label="All Stores" />
            <div className="flex items-center gap-4 mb-6 p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{store}</h2>
                    <p className="font-semibold" style={{ color }}>{formatCurrency(summary.netEarnings)} <span className="text-gray-500 font-normal text-sm">total revenue</span></p>
                </div>
            </div>

            {barData.length > 0 && (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 mb-6">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Tracks on {store}</h3>
                    <div style={{ height: Math.max(180, barData.length * 32) }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 80 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={120} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}
                                    label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: (v) => formatCurrency(v) }}>
                                    {barData.map((_, i) => <Cell key={i} fill={color} fillOpacity={1 - i * 0.04} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300">Top Tracks</h3></div>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-800"><th className="px-4 py-2 text-gray-400 text-left">#</th><th className="px-4 py-2 text-gray-400 text-left">Track</th><th className="px-4 py-2 text-gray-400 text-right">Earnings</th><th className="px-4 py-2 text-gray-400 text-right hidden sm:table-cell">Qty</th></tr></thead>
                        <tbody>
                            {topTracks.map((t, i) => (
                                <TrackRow key={i} track={t} rank={i + 1} onClick={() => t.isrc && onSelectTrack({ isrc: t.isrc, title: t.track })} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300">Top Countries</h3></div>
                    <table className="w-full text-sm">
                        <tbody>
                            {topCountries.map((c, i) => (
                                <tr key={c._id} className={i % 2 === 1 ? 'bg-gray-800/20' : ''}>
                                    <td className="px-4 py-2.5 text-gray-300">{c._id || 'Unknown'}</td>
                                    <td className="px-4 py-2.5 text-right text-gray-500">{formatNumber(c.quantity)}</td>
                                    <td className="px-4 py-2.5 text-right text-purple-400 font-medium">{formatCurrency(c.netEarnings)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function StoresTab({ onSelectTrack, initialStore }) {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(initialStore || null);

    useEffect(() => {
        fetch('/api/analytics/revenue?view=stores')
            .then(r => r.json()).then(d => { setStores(d.stores || []); setLoading(false); });
    }, []);

    useEffect(() => { if (initialStore) setSelected(initialStore); }, [initialStore]);

    if (selected) return <StoreDetail store={selected} onBack={() => setSelected(null)} onSelectTrack={onSelectTrack} />;

    if (loading) return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-36" />)}</div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stores.map(s => <StoreCard key={s._id} store={s} onClick={() => setSelected(s._id)} />)}
        </div>
    );
}
