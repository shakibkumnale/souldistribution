// Shared constants, helpers, and tiny UI primitives for the revenue dashboard

export const PLATFORM_COLORS = {
    Spotify: '#1DB954',
    YouTube: '#FF0000',
    'Apple Music': '#FC3C44',
    ITunes: '#FC3C44',
    Amazon: '#FF9900',
    Deezer: '#EF5466',
    TikTok: '#69C9D0',
    Tidal: '#001AFF',
    Pandora: '#00A0EE',
    Facebook: '#1877F2',
    Snap: '#FFFC00',
    default: '#8b5cf6',
};

export const CHART_COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#a855f7'];

export function getPlatformColor(store) {
    return PLATFORM_COLORS[store] || PLATFORM_COLORS.default;
}

export function formatCurrency(v) {
    if (typeof v !== 'number' || isNaN(v)) return '$0.00';
    if (Math.abs(v) < 0.0001) return '$' + v.toFixed(6);
    if (Math.abs(v) < 0.01) return '$' + v.toFixed(4);
    if (Math.abs(v) >= 1000000) return '$' + (v / 1000000).toFixed(2) + 'M';
    if (Math.abs(v) >= 1000) return '$' + (v / 1000).toFixed(2) + 'K';
    return '$' + v.toFixed(2);
}

export function formatNumber(n) {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
}

export function Skeleton({ className = '' }) {
    return <div className={`animate-pulse bg-gray-800 rounded ${className}`} />;
}

export function StatCard({ icon: Icon, iconClass, label, value, sub }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-gray-100">{value}</p>
                {sub && <p className="text-xs text-gray-500">{sub}</p>}
            </div>
        </div>
    );
}

export function PlatformBadge({ store, earnings }) {
    const color = getPlatformColor(store);
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {store}
            {earnings !== undefined && <span className="ml-1 opacity-75">{formatCurrency(earnings)}</span>}
        </span>
    );
}

export function PlatformBar({ platformBreakdown = [], total }) {
    if (!platformBreakdown.length || !total) return null;
    return (
        <div className="flex h-1.5 rounded-full overflow-hidden w-full mt-2">
            {platformBreakdown.slice(0, 8).map(({ store, netEarnings }) => (
                <div key={store} title={`${store}: ${formatCurrency(netEarnings)}`}
                    style={{ width: `${(netEarnings / total) * 100}%`, backgroundColor: getPlatformColor(store) }} />
            ))}
        </div>
    );
}

export function BackButton({ onClick, label = 'Back' }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6">
            ← {label}
        </button>
    );
}

export function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 text-sm">
            <p className="font-semibold text-white mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ color: p.fill || p.color || '#8b5cf6' }}>
                    {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

export function TrackRow({ track, onClick, rank }) {
    const rel = track.release;
    return (
        <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
            onClick={onClick}>
            {rank !== undefined && <td className="px-4 py-3 text-gray-600 text-xs w-8">{rank}</td>}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {rel?.coverImage
                        ? <img src={rel.coverImage} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
                        : <div className="w-9 h-9 rounded bg-gray-800 flex items-center justify-center text-gray-600 flex-shrink-0">♫</div>}
                    <div className="min-w-0">
                        <p className="text-gray-200 font-medium truncate text-sm">{track.track || track.isrc}</p>
                        {rel?.artists?.length > 0 && <p className="text-xs text-gray-500 truncate">{rel.artists.map(a => a.name).join(', ')}</p>}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-right font-semibold text-purple-400">{formatCurrency(track.netEarnings)}</td>
            <td className="px-4 py-3 text-right text-gray-500 text-sm hidden sm:table-cell">{formatNumber(track.quantity)}</td>
        </tr>
    );
}
