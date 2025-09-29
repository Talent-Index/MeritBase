'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';
import { polygon, polygonMumbai } from 'viem/chains';
import { configureChains, mainnet } from '@wagmi/core';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.NODE_ENV === 'production' ? polygon : polygonMumbai, mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
