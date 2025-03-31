"use client";

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <div className="text-gray-800 mb-6">
          <p>You do not have permission to access this resource.</p>
        </div>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Home
          </button>
          <button 
            onClick={() => router.push('/login')} 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
} 