'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-[#07080f] flex flex-col items-center justify-center z-[200] p-6 text-center">
      <div className="text-9xl mb-8 opacity-20">☄️</div>
      <h2 className="text-4xl font-serif font-bold text-white mb-4">The Oracle is Resting</h2>
      <p className="text-gray-400 max-w-md mb-8">
        A cosmic ripple has disturbed the resonance. The chain's whispers are temporarily obscured.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-500 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
      >
        Try to Reconnect
      </button>
      <a href="/" className="mt-6 text-gray-600 hover:text-white underline underline-offset-4 text-sm">
        Return to Safety
      </a>
    </div>
  );
}
