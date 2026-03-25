'use client';

import { useConnect } from 'wagmi';
import { motion } from 'framer-motion';

export default function ConnectPrompt() {
  const { connect, connectors } = useConnect();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Mystical Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-400/30 rounded-full blur-sm animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <div className="text-6xl text-purple-500 mb-6 flex justify-center">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
          Connect Your Wallet
        </h2>
        
        <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto">
          The Somnia chain holds secrets only the bold can reveal. Let the oracle read your fate.
        </p>

        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-teal-500 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
        >
          Begin Your Journey
        </button>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% { opacity: 0.5; }
          100% {
            transform: translateY(-120vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
