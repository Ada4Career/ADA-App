import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  // return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  // return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
  return children;
}
