'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber, CHART_COLORS, getPlatformColor, BackButton, PlatformBadge, CustomTooltip, TrackRow, Skeleton } from './shared';

// Country flag emoji helper
function countryFlag(code) {
    if (!code || code.length !== 2) return '🌐';
    return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397));
}

function CountryDetail({ country, onBack, onSelectTrack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/analytics/revenue?view=country-detail&country=${encodeURIComponent(country)}`)
            .then(r => r.json()).then(d => { setData(d); setLoading(false); });
    }, [country]);

    if (loading) return <div className="flex justify-center h-48 items-center"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>;

    const { summary = {}, topTracks = [], storeBreakdown = [] } = data || {};

    return (
        <div>
            <BackButton onClick={onBack} label="All Countries" />
            <div className="flex items-center gap-4 mb-6 p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
                <span className="text-5xl">{countryFlag(country)}</span>
                <div>
                    <h2 className="text-2xl font-bold text-white">{country}</h2>
                    <p className="text-purple-400 font-semibold">{formatCurrency(summary.netEarnings)} <span className="text-gray-500 font-normal text-sm">total revenue · {formatNumber(summary.quantity)} streams</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300">Top Tracks in {country}</h3></div>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-800"><th className="px-4 py-2 text-gray-400 text-left">#</th><th className="px-4 py-2 text-gray-400 text-left">Track</th><th className="px-4 py-2 text-gray-400 text-right">Earnings</th><th className="px-4 py-2 text-gray-400 text-right hidden sm:table-cell">Qty</th></tr></thead>
                        <tbody>
                            {topTracks.map((t, i) => <TrackRow key={i} track={t} rank={i + 1} onClick={() => t.isrc && onSelectTrack({ isrc: t.isrc, title: t.track })} />)}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">Revenue by Platform in {country}</h3>
                    {storeBreakdown.length > 0 && (
                        <div style={{ height: Math.max(160, storeBreakdown.length * 30) }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={storeBreakdown} layout="vertical" margin={{ left: 0, right: 72 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="_id" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                    <Bar dataKey="netEarnings" radius={[0, 4, 4, 0]}
                                        label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: (v) => formatCurrency(v) }}>
                                        {storeBreakdown.map(s => <Cell key={s._id} fill={getPlatformColor(s._id)} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CountriesTab({ onSelectTrack, initialCountry }) {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(initialCountry || null);

    useEffect(() => {
        fetch('/api/analytics/revenue?view=countries')
            .then(r => r.json()).then(d => { setCountries(d.countries || []); setLoading(false); });
    }, []);

    useEffect(() => { if (initialCountry) setSelected(initialCountry); }, [initialCountry]);

    if (selected) return <CountryDetail country={selected} onBack={() => setSelected(null)} onSelectTrack={onSelectTrack} />;

    if (loading) return <Skeleton className="h-80 w-full mt-4" />;

    const max = countries[0]?.netEarnings || 1;

    return (
        <div className="space-y-2.5">
            {countries.map((c, i) => (
                <button key={c._id} onClick={() => setSelected(c._id)}
                    className="w-full flex items-center gap-4 p-3 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-purple-600/50 transition-all group">
                    <span className="text-2xl w-8 flex-shrink-0">{countryFlag(c._id)}</span>
                    <span className="text-gray-200 font-medium w-12 text-sm flex-shrink-0">{c._id}</span>
                    <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div className="h-2 rounded-full transition-all" style={{ width: `${(c.netEarnings / max) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        </div>
                    </div>
                    <span className="text-purple-400 font-semibold text-sm w-20 text-right flex-shrink-0">{formatCurrency(c.netEarnings)}</span>
                    <span className="text-gray-600 text-xs w-16 text-right flex-shrink-0 hidden sm:block">{formatNumber(c.quantity)} streams</span>
                </button>
            ))}
        </div>
    );
}
