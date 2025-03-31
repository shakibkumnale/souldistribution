'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Upload, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const [file, setFile] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    if (!reportDate) {
      setError('Please select a report date');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportDate', reportDate);

      const response = await fetch('/api/analytics/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to upload file');
      }

      setUploadResult(data);
      
      toast({
        title: 'Upload Successful',
        description: `Processed ${data.recordsProcessed} out of ${data.totalRecords} records`,
        duration: 5000,
      });
      
      // Reset form
      setFile(null);
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message || 'An error occurred during upload');
      
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload and process file',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Streaming</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Upload LANDR Stream Report</CardTitle>
            <CardDescription>
              Upload the CSV export from LANDR to update streaming statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="reportDate">Report Date</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">LANDR CSV Report</Label>
                <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center space-x-2">
                    <Upload className="h-6 w-6 text-gray-500" />
                    <span>
                      {file ? file.name : 'Choose or drop file...'}
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload the LANDR analytics CSV export
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload and Process'
                )}
              </Button>

              {uploadResult && (
                <Alert className="bg-green-100 dark:bg-green-900 border-green-400 text-green-800 dark:text-green-100 mt-4">
                  <AlertDescription>
                    Successfully processed {uploadResult.recordsProcessed} out of {uploadResult.totalRecords} records.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              View recently uploaded streaming reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Upload your first report to see it here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 