'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFortuneMint } from '@/hooks/useFortuneMint';
import { useToast } from '@/components/Toasts';

type State = 'idle' | 'loading' | 'revealed' | 'minting' | 'minted';

interface FortuneData {
  fortune: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  generatedAt: number;
}

const mysticalTexts = [
  "Reading the chain...",
  "Consulting the ancestors...",
  "Decoding your transactions...",
  "The oracle stirs...",
  "Viewing the echo of your steps..."
];

export default function FortuneGenerator({ stats }: { stats: any }) {
  const [state, setState] = useState<State>('idle');
  const [fortune, setFortune] = useState<FortuneData | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const { showToast } = useToast();

  const { mint, isPending, isConfirming, isConfirmed, txHash, tokenId, error: mintError } = useFortuneMint();

  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % mysticalTexts.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (isConfirming) {
        showToast("Inscribing your fate... ⟳", "loading");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed && tokenId) {
      setState('minted');
      showToast(`Fortune minted! Token #${tokenId} ★`, "success");
    }
  }, [isConfirmed, tokenId]);

  useEffect(() => {
    if (mintError) {
        showToast(mintError.message || "The oracle failed to speak.", "error");
        setState('revealed');
    }
  }, [mintError]);

  const generateFortune = async () => {
    if (!stats) return;
    setState('loading');
    try {
      const res = await fetch('/api/generate-fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: stats.address,
          txCount: stats.txCount,
          totalValueEth: parseFloat(stats.balance),
          uniqueContracts: stats.uniqueContracts,
          firstTxAge: stats.firstTxAge
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setFortune(data);
      setState('revealed');
      showToast("The oracle has spoken ✦", "success");
    } catch (error) {
      showToast("Could not reach the ancestors.", "error");
      setState('idle');
    }
  };

  const startMinting = async () => {
    if (!fortune) return;
    setState('minting');
    mint({
      fortuneText: fortune.fortune,
      txCount: stats.txCount,
      totalValueEth: stats.balance
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-9xl cursor-pointer select-none"
              >
                🔮
              </motion.div>
            </div>

            <button
              onClick={generateFortune}
              disabled={!stats}
              className="px-12 py-5 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl text-xl font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(147,51,234,0.4)] disabled:opacity-50"
            >
              Consult the Oracle
            </button>
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full w-32 h-32 animate-spin" />
              <div className="text-6xl animate-pulse">🔮</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-xl font-serif text-purple-200 h-8 font-syne"
              >
                {mysticalTexts[loadingTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {state === 'revealed' && fortune && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${
                fortune.rarity === 'LEGENDARY' ? 'animate-rainbow border-transparent' : 
                fortune.rarity === 'RARE' ? 'border-[#f0b43a] text-[#f0b43a] shadow-[0_0_10px_rgba(240,180,58,0.3)]' :
                'border-gray-400 text-gray-400'
              }`}>
                {fortune.rarity}
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-serif text-white leading-relaxed px-4">
              {fortune.fortune.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={generateFortune}
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
              >
                Consult Again
              </button>
              <button
                onClick={startMinting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 font-bold hover:shadow-lg transition-all text-sm uppercase tracking-widest"
              >
                Mint This Fortune as NFT
              </button>
            </div>
          </motion.div>
        )}

        {(state === 'minting' || isPending || isConfirming) && (
          <motion.div
            key="minting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center gap-6"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-4 h-8 border-2 border-teal-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-xl font-serif text-white">Inscribing your fate on-chain...</p>
            {txHash && (
              <a 
                href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
                target="_blank"
                className="text-teal-400 text-sm hover:underline"
              >
                View Transaction
              </a>
            )}
          </motion.div>
        )}

        {state === 'minted' && (
          <motion.div
            key="minted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 space-y-8"
          >
            <div className="relative inline-block">
              <div className="text-8xl">📜</div>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: Math.cos((i * 30) * Math.PI / 180) * 150, 
                    y: Math.sin((i * 30) * Math.PI / 180) * 150,
                    opacity: 0 
                  }}
                  transition={{ duration: 1.5 }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-500 rounded-full"
                />
              ))}
            </div>

            <h2 className="text-3xl font-serif font-bold text-white">Fate Inscribed!</h2>
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={() => { setState('idle'); setFortune(null); }}
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
              >
                Consult New Destiny
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
