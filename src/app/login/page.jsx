"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-gray-800/50 shadow-glow-primary">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 relative h-12 w-48">
            <Image
              src="/images/group/logo.png"
              alt="Soul Distribution"
              fill
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">Admin Login</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-500/50 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700"
                  placeholder="Enter your username"
                  required
                />
                <LogIn className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 border-0"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          <Button variant="link" asChild>
            <Link href="/" className="text-gray-300 hover:text-purple-300">
              Return to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 