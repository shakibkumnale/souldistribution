'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorDisplay({ 
  error, 
  reset, 
  title = 'Something went wrong',
  description = 'An unexpected error occurred',
  variant = 'default'
}) {
  const [errorDetails, setErrorDetails] = useState('');
  
  useEffect(() => {
    // Format error message
    if (error) {
      const formattedError = typeof error === 'string' 
        ? error 
        : error.message || 'Unknown error';
      
      setErrorDetails(formattedError);
    }
  }, [error]);

  const variantStyles = {
    default: {
      containerClasses: 'bg-red-900/20 border-red-900/30',
      iconColor: 'text-red-500',
      Icon: AlertTriangle
    },
    warning: {
      containerClasses: 'bg-amber-900/20 border-amber-900/30',
      iconColor: 'text-amber-500',
      Icon: AlertCircle
    }
  };

  const { containerClasses, iconColor, Icon } = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`rounded-md border p-4 ${containerClasses} text-white`}>
      <div className="flex items-start">
        <div className={`mr-3 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <div className="font-medium">{title}</div>
          
          <div className="text-sm text-gray-300">
            <p>{description}</p>
            {errorDetails && (
              <div className="mt-2 p-2 bg-black/30 rounded border border-red-900/30 font-mono text-xs text-red-300 overflow-x-auto">
                {errorDetails}
              </div>
            )}
          </div>
          
          {reset && (
            <button
              onClick={reset}
              className="mt-2 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-primary rounded-md hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 