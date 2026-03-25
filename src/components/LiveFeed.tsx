'use client';

import { useSomniaReactivity, FortuneEvent } from '@/hooks/useSomniaReactivity';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
};

const RarityBadge = ({ rarity }: { rarity: string }) => {
  const colors: Record<string, string> = {
    COMMON: 'border-white/20 text-gray-400',
    RARE: 'border-[#f0b43a] text-[#f0b43a]',
    LEGENDARY: 'animate-rainbow-text border-transparent',
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${colors[rarity] || colors.COMMON}`}>
      {rarity}
    </span>
  );
};

export default function LiveFeed() {
  const { liveEvents, connectionStatus, totalMints } = useSomniaReactivity();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full lg:w-96 bg-[#07080f]/50 backdrop-blur-xl border border-white/5 lg:border-l lg:border-t-0 p-6 flex flex-col h-full lg:h-[calc(100vh-80px)] lg:fixed lg:right-0 lg:top-20 z-40">
      {/* Waveform Animation */}
      <div className="flex items-end justify-center gap-1.5 h-6 mb-4">
        {[0.4, 0.7, 1.0, 0.6, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ height: ['20%', '100%', '20%'] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            className="w-1 bg-purple-500/40 rounded-full"
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-serif font-bold text-white">Live Oracle Feed</h3>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              {connectionStatus === 'connected' ? 'Listening to chain...' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#07080f] to-transparent z-10 opacity-50" />
        <div className="space-y-4 pt-4 h-full">
          <AnimatePresence initial={false}>
            {liveEvents.map((event) => (
              <motion.div
                key={event.txHash + event.tokenId}
                layout
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all select-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-purple-300">
                    {event.wallet.slice(0, 6)}...{event.wallet.slice(-4)}
                  </span>
                  <div className="flex items-center gap-2">
                    <RarityBadge rarity={event.rarity} />
                    <span className="text-[10px] text-gray-500">{formatTimeAgo(event.timestamp)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2 italic font-serif leading-tight">
                  "{event.fortuneText}"
                </p>
                <div className="mt-2 flex justify-end">
                  <a 
                    href={`https://shannon-explorer.somnia.network/tx/${event.txHash}`}
                    target="_blank"
                    className="text-[9px] text-gray-600 hover:text-teal-400 uppercase tracking-tighter"
                  >
                    View TX
                  </a>
                </div>
              </motion.div>
            )).slice(0, 8)}
          </AnimatePresence>
          
          {liveEvents.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
              <span className="text-4xl mb-2">🌪</span>
              <p className="text-xs uppercase tracking-widest">Awaiting the first echo...</p>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07080f] to-transparent z-10 opacity-50" />
      </div>

      <div className="mt-8 pt-4 border-t border-white/5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Total fortunes inscribed:</span>
            <span className="text-sm font-mono font-bold text-white">{totalMints}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/5 rounded-lg border border-teal-500/10 self-start">
            <span className="text-teal-400 text-[10px]">⚡</span>
            <span className="text-[9px] uppercase tracking-tighter text-teal-400 font-bold">
              Powered by Somnia Reactivity
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rainbow-text {
          0% { color: #ff0000; }
          20% { color: #ff00ff; }
          40% { color: #0000ff; }
          60% { color: #00ffff; }
          80% { color: #00ff00; }
          100% { color: #ff0000; }
        }
        .animate-rainbow-text {
          animation: rainbow-text 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
