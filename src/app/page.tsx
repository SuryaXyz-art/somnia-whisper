'use client';

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import ConnectPrompt from '@/components/ConnectPrompt';
import WalletStats from '@/components/WalletStats';
import FortuneGenerator from '@/components/FortuneGenerator';
import FortuneGallery from '@/components/FortuneGallery';
import LiveFeed from '@/components/LiveFeed';
import ReactivityBanner from '@/components/ReactivityBanner';
import { useState, useEffect } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: stats } = useQuery({
    queryKey: ['wallet-stats', address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/wallet-stats/${address}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    enabled: !!address && mounted,
  });

  if (!mounted) return null;

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex flex-col lg:flex-row relative">
        {/* Main Content Area */}
        <div className={`flex-grow transition-all duration-700 ${isConnected ? 'lg:w-[60%] lg:pr-4' : 'w-full'}`}>
          {!isConnected ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
              <ConnectPrompt />
            </div>
          ) : (
            <div className="container mx-auto py-8 px-6 lg:pl-12 lg:pr-8 space-y-12">
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <WalletStats />
              </section>
              
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <ReactivityBanner />
              </section>

              <section id="oracle-section" className="border-t border-white/5 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <FortuneGenerator stats={stats} />
              </section>

              <section className="border-t border-white/5 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <FortuneGallery />
              </section>
            </div>
          )}
        </div>

        {/* Sticky Live Feed Sidebar */}
        {isConnected && (
          <aside className="w-full lg:w-[40%] bg-[#07080f]/40 backdrop-blur-md lg:border-l border-t lg:border-t-0 border-white/5 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-hidden">
            <LiveFeed />
          </aside>
        )}
      </div>

      <footer className={`py-12 bg-black/40 border-t border-white/5 text-center relative z-10 transition-all ${isConnected ? 'lg:pr-[40%]' : ''}`}>
        <div className="container mx-auto px-6">
          <p className="text-gray-500 text-sm font-serif">
            ✦ Inscribed in the Somnia chain for eternity ✦
          </p>
          <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-700">
            <span>Somnia Shannon Testnet</span>
            <span>Anthropic Oracle</span>
            <span>Real-time Reactivity</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
