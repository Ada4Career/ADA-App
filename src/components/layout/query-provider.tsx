'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const client = new QueryClient();
export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
