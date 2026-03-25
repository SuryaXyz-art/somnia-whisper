'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

interface WalletStatsData {
  address: string;
  txCount: number;
  balance: string;
  uniqueContracts: number;
  firstTxAge: number;
  blockNumber: string;
  hasExistingFortune: boolean;
  fetchedAt: number;
  note?: string;
}

const StatCell = ({ label, value, icon, accentColor, isLoading }: { 
  label: string, 
  value?: string | number, 
  icon: string, 
  accentColor: string, 
  isLoading: boolean 
}) => (
  <div className="bg-[#0e1120] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10 group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>{icon}</span>
      {isLoading && <div className="w-12 h-4 bg-white/5 animate-pulse rounded" />}
    </div>
    
    {isLoading ? (
      <div className="space-y-2">
        <div className="h-8 bg-white/5 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-white/5 animate-pulse rounded w-1/2" />
      </div>
    ) : (
      <>
        <div className={`text-3xl font-bold font-syne mb-1 tracking-tight`} style={{ color: accentColor }}>
          {value}
        </div>
        <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          {label}
        </div>
      </>
    )}
  </div>
);

export default function WalletStats() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch, isFetching } = useQuery<WalletStatsData>({
    queryKey: ['wallet-stats', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/wallet-stats/${address}`);
      if (!res.ok) throw new Error('Could not read the chain\'s whispers');
      return res.json();
    },
    enabled: !!address,
    refetchInterval: 30000,
  });

  if (!address) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-serif font-bold text-white mb-1">Chain Resonance</h3>
          <p className="text-sm text-gray-400">Your presence within the Somnia network</p>
        </div>
        
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <span className={isFetching ? 'animate-spin' : ''}>⟳</span>
          {isFetching ? 'Synchronizing...' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mb-8">
          <span className="mr-2">⚠</span> Could not read the chain's whispers.
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <StatCell 
            label="Total Transactions" 
            value={data?.txCount} 
            icon="⟳" 
            accentColor="#9333ea" 
            isLoading={isLoading} 
          />
          <StatCell 
            label="STT Balance" 
            value={data ? `${parseFloat(data.balance).toFixed(4)}` : undefined} 
            icon="◈" 
            accentColor="#14b8a6" 
            isLoading={isLoading} 
          />
          <StatCell 
            label="Unique Contracts" 
            value={data?.uniqueContracts} 
            icon="⬡" 
            accentColor="#f59e0b" 
            isLoading={isLoading} 
          />
          <StatCell 
            label="Wallet Age (Days)" 
            value={data?.firstTxAge} 
            icon="◷" 
            accentColor="#ef4444" 
            isLoading={isLoading} 
          />
        </motion.div>
      )}
    </div>
  );
}
