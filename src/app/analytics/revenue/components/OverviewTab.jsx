'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Music, Layers, Users } from 'lucide-react';
import { formatCurrency, formatNumber, CHART_COLORS, getPlatformColor, StatCard, CustomTooltip, Skeleton } from './shared';

function MonthLabel({ year, month }) {
    const d = new Date(year, month - 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export default function OverviewTab({ onSelectStore, onSelectCountry }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics/revenue?view=overview')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-60" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-64" /><Skeleton className="h-64" />
            </div>
        </div>
    );

    if (!data) return null;

    const { summary = {}, topStores = [], topCountries = [], monthlyTrend = [] } = data;
    const trendData = monthlyTrend.map(m => ({ name: MonthLabel({ year: m._id.year, month: m._id.month }), earnings: m.netEarnings, streams: m.quantity }));
    const storeTotal = topStores.reduce((s, st) => s + st.netEarnings, 0);

    return (
        <div className="space-y-6">
            {/* Hero stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={DollarSign} iconClass="bg-purple-900/50 text-purple-400" label="Total Revenue" value={formatCurrency(summary.totalNetEarnings)} sub="lifetime net" />
                <StatCard icon={Music} iconClass="bg-blue-900/50 text-blue-400" label="Total Streams" value={formatNumber(summary.totalQuantity)} sub="all platforms" />
                <StatCard icon={Layers} iconClass="bg-pink-900/50 text-pink-400" label="Platforms" value={topStores.length} sub="active stores" />
                <StatCard icon={Users} iconClass="bg-teal-900/50 text-teal-400" label="Countries" value={topCountries.length} sub="reaching" />
            </div>

            {/* Revenue trend */}
            {trendData.length > 0 && (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">Revenue Over Time</h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} fill="url(#earnGrad)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stores */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">Revenue by Platform</h3>
                    <div className="h-52 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={topStores} dataKey="netEarnings" nameKey="_id" cx="50%" cy="50%" outerRadius={75} innerRadius={40} label={false}>
                                    {topStores.map(s => <Cell key={s._id} fill={getPlatformColor(s._id)} />)}
                                </Pie>
                                <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                                        <p style={{ color: getPlatformColor(payload[0].name) }}>{payload[0].name}</p>
                                        <p className="text-white font-bold">{formatCurrency(payload[0].value)}</p>
                                    </div>
                                ) : null} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {topStores.map((s, i) => (
                            <button key={s._id} onClick={() => onSelectStore(s._id)}
                                className="w-full flex items-center gap-2 hover:bg-gray-800/50 rounded-lg px-2 py-1.5 transition-colors text-left">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: getPlatformColor(s._id) }} />
                                <span className="text-gray-300 text-sm flex-1 truncate">{s._id}</span>
                                <span className="text-purple-400 text-sm font-medium">{formatCurrency(s.netEarnings)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Countries */}
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Countries</h3>
                    <div className="h-72 overflow-y-auto">
                        <ResponsiveContainer width="100%" height={Math.max(220, topCountries.length * 28)}>
                            <BarChart data={topCountries.slice(0, 15)} layout="vertical" margin={{ left: 20, right: 60 }}
                                onClick={(d) => d?.activePayload?.[0] && onSelectCountry(d.activePayload[0].payload._id)}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="_id" tick={{ fill: '#9ca3af', fontSize: 11 }} width={30} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="netEarnings" radius={[0, 4, 4, 0]} cursor="pointer" label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: (v) => formatCurrency(v) }}>
                                    {topCountries.slice(0, 15).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
