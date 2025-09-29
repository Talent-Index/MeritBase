'use client';

import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: process.env.NODE_ENV === 'production' ? polygon : polygonMumbai,
    transport: http(),
  }),
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
