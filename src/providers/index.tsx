// =============================================================================
// Providers - React context providers for the application
// Professor Bola Akanji - Economics, Trade & Development Research Website
// =============================================================================

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState, type ReactNode } from 'react';

// -----------------------------------------------------------------------------
// QueryProvider - TanStack Query provider
// -----------------------------------------------------------------------------

function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// -----------------------------------------------------------------------------
// ThemeProvider - next-themes provider
// -----------------------------------------------------------------------------

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

// -----------------------------------------------------------------------------
// AppProviders - Combined providers wrapper
// -----------------------------------------------------------------------------

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}

export { QueryProvider, ThemeProvider };
