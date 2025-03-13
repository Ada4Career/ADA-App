import { QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const client = new QueryClient();
export default function AppLayout({ children }: { children: ReactNode }) {
  // return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  // return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
  return children;
}
