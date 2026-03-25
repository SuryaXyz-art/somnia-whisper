export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#07080f] flex flex-col items-center justify-center z-[200]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="w-48 h-48 border-4 border-t-purple-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full animate-spin duration-[3s]" />
        <div className="absolute inset-0 flex items-center justify-center text-8xl animate-pulse">
          🔮
        </div>
      </div>
      <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
        Consulting the Void
      </h2>
      <p className="mt-4 text-gray-500 text-sm animate-pulse">Establishing resonance with Somnia...</p>
    </div>
  );
}
