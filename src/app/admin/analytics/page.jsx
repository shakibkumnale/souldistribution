'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Loader2,
  Upload,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  SkipForward,
  XCircle,
  FileText,
  Trash2,
  RefreshCw,
  TrendingUp,
  Database,
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { toast } = useToast();

  // ── Upload state ────────────────────────────────────────────────
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  // ── Stream record count state ────────────────────────────────────
  const [recordCount, setRecordCount] = useState(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch total stream record count ──────────────────────────────
  const fetchCount = useCallback(async () => {
    setIsLoadingCount(true);
    try {
      const res = await fetch('/api/analytics/streamdata');
      if (res.ok) {
        const data = await res.json();
        setRecordCount(data.count ?? 0);
      }
    } catch (_) {
      // silent
    } finally {
      setIsLoadingCount(false);
    }
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  // ── File handlers ─────────────────────────────────────────────────
  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) {
      setFile(f);
      setUploadError('');
    } else {
      setFile(null);
      setUploadError('Please select a valid .csv file');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Upload ─────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setUploadError('Please select a file'); return; }

    setIsUploading(true);
    setUploadError('');
    setUploadResult(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      // reportDate is optional — API auto-extracts from filename

      const res = await fetch('/api/analytics/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Upload failed');

      setUploadResult(data);
      toast({
        title: 'Upload successful',
        description: `${data.inserted} inserted · ${data.skipped} skipped · date: ${data.reportDate}`,
      });
      setFile(null);
      const inp = document.getElementById('stream-file-input');
      if (inp) inp.value = '';
      fetchCount();
    } catch (err) {
      setUploadError(err.message);
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  // ── Delete All ─────────────────────────────────────────────────────
  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${recordCount ?? ''} stream records? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/analytics/streamdata', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      toast({ title: 'Deleted', description: data.message });
      setRecordCount(0);
      setUploadResult(null);
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics &amp; Streaming</h1>
          <p className="text-sm text-gray-400 mt-1">
            Upload <span className="font-medium text-purple-400">LANDR Trends Breakdown</span> CSV reports to track stream counts
          </p>
        </div>
        <Link href="/analytics/revenue">
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:border-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Upload Card ── */}
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Upload Trends Report
            </CardTitle>
            <CardDescription>
              Upload the <strong>LANDR_TrendsBreakdown_*.csv</strong> file. The report date is
              automatically extracted from the filename. Duplicate entries are skipped.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-700 hover:border-purple-600'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('stream-file-input').click()}
              >
                <input
                  id="stream-file-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="h-8 w-8 text-purple-400" />
                    <p className="font-medium text-gray-200 text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-8 w-8 text-gray-500" />
                    <p className="text-sm text-gray-400">
                      Drop .csv file or <span className="text-purple-400">browse</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      e.g. LANDR_TrendsBreakdown_YYYYMMDD.csv
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isUploading || !file}
              >
                {isUploading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                  : <><Upload className="mr-2 h-4 w-4" />Upload Stream Report</>}
              </Button>

              {/* Result stats */}
              {uploadResult && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: CheckCircle2, value: uploadResult.inserted, label: 'Inserted', color: 'green' },
                    { icon: SkipForward, value: uploadResult.skipped, label: 'Skipped', color: 'yellow' },
                    { icon: XCircle, value: uploadResult.unmatched ?? 0, label: 'Unmatched', color: 'gray' },
                  ].map(({ icon: I, value, label, color }) => (
                    <div
                      key={label}
                      className={`flex flex-col items-center p-2 rounded-lg bg-${color}-900/30 border border-${color}-800`}
                    >
                      <I className={`h-4 w-4 text-${color}-500 mb-1`} />
                      <span className={`text-xl font-bold text-${color}-400`}>{value}</span>
                      <span className={`text-xs text-${color}-500`}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* ── Database Management Card ── */}
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Stream Data Records
            </CardTitle>
            <CardDescription>
              View and manage all stream data records stored in the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Record count */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div>
                <p className="text-sm text-gray-400">Total records</p>
                {isLoadingCount ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400 mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-white">
                    {recordCount?.toLocaleString() ?? '—'}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCount}
                disabled={isLoadingCount}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingCount ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Delete all */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Permanently remove <strong className="text-white">all</strong> stream records from the database.
                This action is <span className="text-red-400 font-semibold">irreversible</span>.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteAll}
                disabled={isDeleting || recordCount === 0}
              >
                {isDeleting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>
                  : <><Trash2 className="mr-2 h-4 w-4" />Delete All Stream Records</>}
              </Button>
            </div>

            {/* Hint */}
            <div className="text-xs text-gray-600 border-t border-gray-800 pt-3">
              <p>CSV format expected:</p>
              <p className="mt-1 font-mono text-gray-500 text-[11px]">
                Name, Id, # Streams, Streams %, # Streams change, Streams change %, # Downloads, ...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}