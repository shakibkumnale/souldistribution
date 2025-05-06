'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, FileDollarSign, Filter, Loader2, MapPin, AlertCircle, RefreshCw, Music, Store, DollarSign, Play, UploadCloud, CheckCircle2, FileType, Download, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Helper function to format numbers as currency
function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

// Helper function to format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Random colors for pie charts
const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f59e0b'];
const COUNTRY_COLORS = {
  US: '#8b5cf6',
  IN: '#6366f1',
  GB: '#3b82f6',
  CA: '#0ea5e9',
  AU: '#06b6d4',
  default: '#14b8a6'
};

export default function AdminRevenueReportsPage() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  
  // For a simple search filter on the reports list
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load reports on initial page load
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/revenue/reports');
      
      if (!response.ok) {
        throw new Error('Failed to load reports');
      }
      
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setFilename('');
      return;
    }
    
    // Check if file is CSV
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      setFilename('');
      return;
    }
    
    setFile(selectedFile);
    setFilename(selectedFile.name);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError('');
    setSuccess('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analytics/revenue/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }
      
      // Clear the file input
      setFile(null);
      setFilename('');
      
      // Show success message
      setSuccess(`Successfully processed ${data.count} revenue entries from ${filename}`);
      
      // Refresh reports list
      fetchReports();
      
      // Switch to the manage tab to see the newly uploaded report
      setActiveTab('manage');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report and all its data?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/revenue/reports/${reportId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      
      // Refresh the reports list
      fetchReports();
      setSuccess('Report deleted successfully');
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter reports based on search term
  const filteredReports = reports.filter(report => 
    report.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Revenue Reports</h1>
        <p className="text-gray-500">Upload and manage LANDR royalty reports</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Report</TabsTrigger>
          <TabsTrigger value="manage">Manage Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Revenue Report</CardTitle>
              <CardDescription>
                Upload your LANDR royalty CSV reports to track your revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file">Revenue Report File (CSV)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {filename ? (
                          <>
                            <FileType className="w-10 h-10 mb-3 text-purple-600" />
                            <p className="mb-2 text-sm text-gray-700">
                              <span className="font-semibold">{filename}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Click to change file
                            </p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-700">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              CSV files only
                            </p>
                          </>
                        )}
                      </div>
                      <Input
                        id="file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading || !file}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Revenue Report'
                    )}
                  </Button>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Expected CSV format from LANDR royalty reports with columns including:</p>
                    <p className="mt-1">
                      Payment Date, Start of reporting period, End of reporting period, Store, Store service, 
                      Country of sale or stream, Album, UPC, Track, ISRC, Primary artist(s), 
                      Quantity of sales or streams, Gross earnings (USD), Net earnings (USD), Share %
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Revenue Reports</CardTitle>
              <CardDescription>
                View and manage uploaded revenue reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                  <span className="ml-2">Loading reports...</span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No reports match your search' : 'No reports have been uploaded yet'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2">Filename</th>
                        <th className="px-4 py-2">Upload Date</th>
                        <th className="px-4 py-2">Entries</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <FileType className="h-4 w-4 mr-2 text-purple-600" />
                              {report.filename}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(report.uploadDate).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {report.entriesCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteReport(report._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchReports} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 