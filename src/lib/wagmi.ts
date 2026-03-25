import { createConfig, http } from 'wagmi';
import { somniaTestnet } from './chains';
import { QueryClient } from '@tanstack/react-query';

export const config = createConfig({
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(),
  },
  ssr: true,
});

export const queryClient = new QueryClient();
