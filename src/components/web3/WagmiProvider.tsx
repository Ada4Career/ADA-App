'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

// Dummy Web3 provider for demo purposes
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}