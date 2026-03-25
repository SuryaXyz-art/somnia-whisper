'use client';

import { motion } from 'framer-motion';
import { useWalletFortunes } from '@/hooks/useWalletFortunes';

export default function FortuneGallery() {
  const { fortunes, isLoading, refetch } = useWalletFortunes();

  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center mb-12">
        <h3 className="text-3xl font-serif font-bold text-white mb-2">Your Echoes</h3>
        <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Archived fate inscriptions</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0e1120] border border-white/5 rounded-2xl p-4 animate-pulse">
              <div className="aspect-square bg-white/5 rounded-xl mb-4" />
              <div className="h-6 bg-white/5 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : fortunes.length === 0 ? (
        <div className="text-center py-20 bg-[#0e1120]/30 border border-dashed border-white/10 rounded-3xl">
          <div className="text-5xl mb-4 opacity-30">📜</div>
          <p className="text-gray-500 mb-6">No fortunes have been inscribed yet.</p>
          <button 
             onClick={() => document.getElementById('oracle-section')?.scrollIntoView({ behavior: 'smooth' })}
             className="px-6 py-2 rounded-full border border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/10 transition-all font-syne"
          >
            Consult the Oracle
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {fortunes.map((nft, i) => (
            <motion.div
              key={nft.tokenId}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#0e1120] border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/5">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400">NFT #{nft.tokenId}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                    nft.rarity === 'LEGENDARY' ? 'border-transparent animate-rainbow-text' : 
                    nft.rarity === 'RARE' ? 'border-[#f0b43a] text-[#f0b43a]' : 'border-gray-600 text-gray-500'
                  }`}>
                    {nft.rarity}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3 italic font-serif leading-relaxed h-[4.5rem]">
                  "{nft.description}"
                </p>
                <div className="pt-2 border-t border-white/5 text-[10px] text-gray-600 flex justify-between uppercase tracking-tighter">
                  <span>Inscribed {nft.timestamp}</span>
                  <a href={`https://shannon-explorer.somnia.network/token/${NEXT_PUBLIC_CONTRACT_ADDRESS}/${nft.tokenId}`} target="_blank" className="hover:text-teal-400">View On-Chain</a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/lib/config';
