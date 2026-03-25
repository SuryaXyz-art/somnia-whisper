'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const truncateAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-[#07080f]/80 backdrop-blur-md border-b border-purple-500/20"
    >
      <div className="container mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-2xl text-purple-400 group-hover:rotate-45 transition-transform duration-500">✦</span>
          <h1 className="text-xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            SomniaWhisper
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono text-gray-300">
                  {truncateAddress(address!)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 rounded-lg text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="relative px-6 py-2 group overflow-hidden rounded-lg transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-sm font-semibold text-white">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
