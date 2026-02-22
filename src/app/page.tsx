import { GlobalConfig } from "@/components/calculator/GlobalConfig";
import { RoomConfig } from "@/components/calculator/RoomConfig";
import { RoommateConfig } from "@/components/calculator/RoommateConfig";
import { ResultsVisualization } from "@/components/calculator/ResultsVisualization";
import { ShareButton } from "@/components/calculator/ShareButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Rent Split <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Optimizer</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Calculate a mathematically fair rent distribution for your shared apartment based on room sizes, amenities, and common spaces.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Configuration Column */}
          <div className="xl:col-span-5 space-y-8">
            <GlobalConfig />
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
              <RoomConfig />
            </div>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
              <RoommateConfig />
            </div>

            <div className="pt-4 flex justify-center w-full">
              <ShareButton />
            </div>
          </div>

          {/* Visualization Column */}
          <div className="xl:col-span-7 space-y-8">
            <div className="sticky top-8">
              <ResultsVisualization />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
