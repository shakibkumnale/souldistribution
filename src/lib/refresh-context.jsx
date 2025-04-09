'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Create a context for refreshing data
export const RefreshContext = createContext(null);

// Create a provider component
export function RefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastPath, setLastPath] = useState('');
  const pathname = usePathname();

  // Create refresh function
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Track route changes to trigger refresh when needed
    if (lastPath && lastPath !== pathname) {
      // If we've changed routes, refresh the data
      refresh();
    }
    setLastPath(pathname);
  }, [pathname, lastPath, refresh]);

  return (
    <RefreshContext.Provider value={{ refresh, lastPath, refreshKey }}>
      {children}
    </RefreshContext.Provider>
  );
}

// Create a custom hook for using the refresh context
export function useRefresh() {
  const context = useContext(RefreshContext);
  if (context === null) {
    // Return a default value if context is not available
    return { 
      refresh: () => {}, 
      lastPath: '', 
      refreshKey: 0 
    };
  }
  return context;
} 