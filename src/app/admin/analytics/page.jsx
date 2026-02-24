'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Upload, AlertCircle, BarChart3, CheckCircle2, SkipForward, XCircle, FileText, Database } from 'lucide-react';
import Link from 'next/link';

function UploadCard({ title, description, accept, endpoint, icon: Icon, iconColor }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { toast } = useToast();
  const inputId = `file-${endpoint.replace(/\//g, '-')}`;

  const handleFile = (f) => {
    const isValid = accept.split(',').some(ext => f?.name?.endsWith(ext.trim()));
    if (f && isValid) { setFile(f); setError(''); }
    else { setFile(null); setError(`Please select a valid file (${accept})`); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    setIsLoading(true); setError(''); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Upload failed');
      setResult(data);
      toast({ title: 'Success', description: `${data.inserted} inserted, ${data.skipped} skipped` });
      setFile(null);
      const inp = document.getElementById(inputId);
      if (inp) inp.value = '';
    } catch (err) {
      setError(err.message);
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById(inputId).click()}
          >
            <input id={inputId} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex flex-col items-center gap-1">
                <FileText className="h-8 w-8 text-purple-400" />
                <p className="font-medium text-gray-200 text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-8 w-8 text-gray-500" />
                <p className="text-sm text-gray-400">Drop {accept} file or <span className="text-purple-400">browse</span></p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading || !file}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : <><Upload className="mr-2 h-4 w-4" />Upload</>}
          </Button>

          {result && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: CheckCircle2, value: result.inserted, label: 'Inserted', color: 'green' },
                { icon: SkipForward, value: result.skipped, label: 'Skipped', color: 'yellow' },
                { icon: XCircle, value: result.failed ?? 0, label: 'Failed', color: 'gray' },
              ].map(({ icon: I, value, label, color }) => (
                <div key={label} className={`flex flex-col items-center p-2 rounded-lg bg-${color}-900/30 border border-${color}-800`}>
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
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <Link href="/analytics/revenue">
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:border-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" /> View Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadCard
          title="Upload LANDR CSV Report"
          description="Upload the monthly Royalties Detailed Report CSV from LANDR. Duplicates are automatically skipped."
          accept=".csv"
          endpoint="/api/analytics/revenue/upload"
          icon={Upload}
          iconColor="text-purple-500"
        />
        <UploadCard
          title="Import MongoDB JSON Dump"
          description="Import a MongoDB JSON export (soul_clone.revenuedatas.json). Existing documents are skipped by _id."
          accept=".json"
          endpoint="/api/analytics/revenue/import"
          icon={Database}
          iconColor="text-blue-500"
        />
      </div>
    </div>
  );
}