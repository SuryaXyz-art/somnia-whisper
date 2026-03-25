'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReactivityBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#0e1120]/50 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-gray-400 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-purple-400">ℹ</span>
          What is Somnia Reactivity?
        </div>
        <span className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2 space-y-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                Unlike traditional blockchains that require constant polling, Somnia pushes events directly to this app in real-time. 
                The live feed above updates the instant a fortune is minted — no refresh needed, no intermediary indexer required.
              </p>

              {/* 3-Step Diagram */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-4 bg-black/20 rounded-xl border border-white/5">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-sm">1</div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Contract emits event</span>
                </div>
                
                <div className="hidden md:block text-gray-700">→</div>
                
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-sm">2</div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">Validators push data</span>
                </div>
                
                <div className="hidden md:block text-gray-700">→</div>
                
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm">3</div>
                  <span className="text-[10px] uppercase font-bold text-gray-500">App receives instantly</span>
                </div>
              </div>

              <div className="flex justify-end">
                <a 
                  href="https://docs.somnia.network/developer/reactivity" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4"
                >
                  Learn more at docs.somnia.network
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
