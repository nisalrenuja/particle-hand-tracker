import ParticleHandTracker from "@/components/ParticleHandTracker";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      <ErrorBoundary>
        <ParticleHandTracker />
      </ErrorBoundary>
      
      {/* Cyberpunk Overlay Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
          <div className="absolute top-0 right-0 w-[1px] h-32 bg-gradient-to-b from-cyan-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-[1px] h-32 bg-gradient-to-t from-pink-500 to-transparent"></div>
      </div>
    </main>
  );
}
