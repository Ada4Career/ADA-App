import { createConfig, http } from 'wagmi';
import { lisk, liskSepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [lisk, liskSepolia],
  connectors: [
    metaMask(),
    injected(), // Fallback for MetaMask or other injected wallets
  ],
  transports: {
    [lisk.id]: http('https://rpc.api.lisk.com'),
    [liskSepolia.id]: http('https://rpc.sepolia-api.lisk.com'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}