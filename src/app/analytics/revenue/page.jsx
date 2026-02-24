'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Music, Globe, Upload } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatNumber, getPlatformColor, CHART_COLORS, BackButton, PlatformBadge, CustomTooltip, Skeleton } from './components/shared';
import OverviewTab from './components/OverviewTab';
import ArtistsTab from './components/ArtistsTab';
import TracksTab from './components/TracksTab';
import StoresTab from './components/StoresTab';
import CountriesTab from './components/CountriesTab';

// ── Release Detail Panel ─────────────────────

function ReleaseDetail({ release, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowPage, setRowPage] = useState(1);
  const [rowTotal, setRowTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 25;

  const fetchDetail = useCallback(async () => {
    const param = release.isrc ? `isrc=${encodeURIComponent(release.isrc)}` : `release=${release._id}`;
    const res = await fetch(`/api/analytics/revenue?view=detail&${param}&limit=${LIMIT}&page=1`);
    const d = await res.json();
    setData(d);
    setRows(d.rows || []);
    setRowTotal(d.total || 0);
    setLoading(false);
  }, [release]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const loadMore = async () => {
    setLoadingMore(true);
    const next = rowPage + 1;
    const param = release.isrc ? `isrc=${encodeURIComponent(release.isrc)}` : `release=${release._id}`;
    const res = await fetch(`/api/analytics/revenue?view=detail&${param}&limit=${LIMIT}&page=${next}`);
    const d = await res.json();
    setRows(prev => [...prev, ...(d.rows || [])]);
    setRowPage(next);
    setLoadingMore(false);
  };

  if (loading) return <div className="flex justify-center h-48 items-center"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>;

  const releaseInfo = data?.release || release;
  const summary = data?.summary || {};
  const platforms = data?.platformBreakdown || release.platformBreakdown || [];
  const countries = data?.countryBreakdown || [];
  const barData = platforms.slice(0, 10).map(p => ({ store: p._id || p.store, earnings: p.netEarnings, fill: getPlatformColor(p._id || p.store) }));

  return (
    <div>
      <BackButton onClick={onBack} label="Back" />

      <div className="flex flex-col sm:flex-row gap-5 mb-6 p-5 bg-gray-900/60 border border-gray-800 rounded-xl">
        {releaseInfo?.coverImage
          ? <img src={releaseInfo.coverImage} alt="" className="w-24 h-24 rounded-lg object-cover ring-2 ring-purple-700 flex-shrink-0" />
          : <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-800 to-pink-700 flex items-center justify-center flex-shrink-0"><Music className="w-10 h-10 text-purple-200" /></div>}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">{releaseInfo?.title || release.title || release.isrc}</h2>
          {releaseInfo?.artists?.length > 0 && <p className="text-gray-400 text-sm mb-2">{releaseInfo.artists.map(a => a.name).join(', ')}</p>}
          {(release.isrc || releaseInfo?.isrc) && <span className="font-mono text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-500">{release.isrc || releaseInfo.isrc}</span>}
          <div className="flex flex-wrap gap-6 mt-3">
            <div><p className="text-xs text-gray-500 uppercase tracking-wider">Lifetime Earnings</p><p className="text-2xl font-bold text-purple-400">{formatCurrency(summary.totalNetEarnings || release.totalNetEarnings)}</p></div>
            <div><p className="text-xs text-gray-500 uppercase tracking-wider">Total Streams</p><p className="text-2xl font-bold text-blue-400">{formatNumber(summary.totalQuantity || release.totalQuantity)}</p></div>
          </div>
        </div>
      </div>

      {barData.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Revenue by Platform</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 60, right: 80 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="store" tick={{ fill: '#9ca3af', fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="earnings" radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#9ca3af', fontSize: 10, formatter: (v) => formatCurrency(v) }}>
                  {barData.map(e => <Cell key={e.store} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300">By Platform</h3></div>
          <table className="w-full text-sm"><tbody>
            {platforms.map((p, i) => { const n = p._id || p.store; return <tr key={n} className={i % 2 === 1 ? 'bg-gray-800/20' : ''}><td className="px-4 py-2.5"><PlatformBadge store={n} /></td><td className="px-4 py-2.5 text-right text-gray-400">{formatNumber(p.quantity)}</td><td className="px-4 py-2.5 text-right text-purple-400 font-medium">{formatCurrency(p.netEarnings)}</td></tr>; })
            }
          </tbody></table>
        </div>
        {countries.length > 0 && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2"><Globe className="w-4 h-4" />Top Countries</h3></div>
            <table className="w-full text-sm"><tbody>
              {countries.map((c, i) => <tr key={c._id} className={i % 2 === 1 ? 'bg-gray-800/20' : ''}><td className="px-4 py-2.5 text-gray-300">{c._id || '—'}</td><td className="px-4 py-2.5 text-right text-gray-400">{formatNumber(c.quantity)}</td><td className="px-4 py-2.5 text-right text-purple-400 font-medium">{formatCurrency(c.netEarnings)}</td></tr>)}
            </tbody></table>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800"><h3 className="text-sm font-semibold text-gray-300">Payment History ({rowTotal})</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-800"><th className="px-4 py-2 text-gray-400 text-left">Date</th><th className="px-4 py-2 text-gray-400 text-left">Store</th><th className="px-4 py-2 text-gray-400 text-left hidden sm:table-cell">Country</th><th className="px-4 py-2 text-gray-400 text-right">Qty</th><th className="px-4 py-2 text-gray-400 text-right">Net</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r._id || i} className={i % 2 === 1 ? 'bg-gray-800/20' : ''}>
                    <td className="px-4 py-2 text-gray-400">{r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                    <td className="px-4 py-2"><PlatformBadge store={r.store} /></td>
                    <td className="px-4 py-2 text-gray-400 hidden sm:table-cell">{r.country || '—'}</td>
                    <td className="px-4 py-2 text-right text-gray-300">{r.quantity}</td>
                    <td className="px-4 py-2 text-right text-purple-400 font-medium">{formatCurrency(r.netEarnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length < rowTotal && (
            <div className="flex justify-center p-4">
              <button onClick={loadMore} disabled={loadingMore} className="text-sm text-gray-400 hover:text-purple-300 flex items-center gap-2">
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load More ({rows.length}/{rowTotal})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'artists', label: 'Artists' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'stores', label: 'Stores' },
  { id: 'countries', label: 'Countries' },
];

export default function RevenueAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [drillStore, setDrillStore] = useState(null);
  const [drillCountry, setDrillCountry] = useState(null);

  const handleSelectStore = (store) => { setDrillStore(store); setActiveTab('stores'); };
  const handleSelectCountry = (country) => { setDrillCountry(country); setActiveTab('countries'); };
  const handleSelectTrack = (track) => { setSelectedRelease(track); };
  const handleSelectRelease = (release) => { setSelectedRelease(release); };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRelease(null);
    if (tab !== 'stores') setDrillStore(null);
    if (tab !== 'countries') setDrillCountry(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-300 bg-clip-text text-transparent">
              Revenue Analytics
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Lifetime earnings from all platforms · per artist, track, store & country</p>
          </div>
          <Link href="/admin/analytics">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-purple-600 hover:text-purple-300 text-sm transition-colors">
              <Upload className="w-4 h-4" /> Import
            </button>
          </Link>
        </header>

        {/* Tab bar */}
        {!selectedRelease && (
          <div className="flex gap-1 mb-8 bg-gray-900/60 border border-gray-800 rounded-xl p-1.5">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {selectedRelease ? (
          <ReleaseDetail release={selectedRelease} onBack={() => setSelectedRelease(null)} />
        ) : activeTab === 'overview' ? (
          <OverviewTab onSelectStore={handleSelectStore} onSelectCountry={handleSelectCountry} />
        ) : activeTab === 'artists' ? (
          <ArtistsTab onSelectRelease={handleSelectRelease} />
        ) : activeTab === 'tracks' ? (
          <TracksTab onSelectTrack={handleSelectTrack} />
        ) : activeTab === 'stores' ? (
          <StoresTab onSelectTrack={handleSelectTrack} initialStore={drillStore} />
        ) : activeTab === 'countries' ? (
          <CountriesTab onSelectTrack={handleSelectTrack} initialCountry={drillCountry} />
        ) : null}
      </div>
    </div>
  );
}