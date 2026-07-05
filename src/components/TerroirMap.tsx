import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INDONESIAN_REGIONS } from "../data";
import { TerroirRegion } from "../types";
import { MapPin, Info, Flame, Award } from "lucide-react";

export default function TerroirMap() {
  const [selectedRegion, setSelectedRegion] = useState<TerroirRegion>(INDONESIAN_REGIONS[0]);

  // Mini map marker positions (relative coordinates for standard styling)
  const markerPositions: Record<string, { top: string; left: string }> = {
    sumatra: { top: "35%", left: "15%" },
    java: { top: "68%", left: "38%" },
    bali: { top: "72%", left: "55%" },
    sulawesi: { top: "42%", left: "62%" },
    flores: { top: "74%", left: "72%" }
  };

  return (
    <section className="py-24 bg-art-bg text-art-text" id="terroir-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-art-gold font-mono text-xs tracking-widest uppercase block mb-3">Origin & Terroirs</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-art-text-heading mb-4">
            印尼火山精品產地探尋
          </h2>
          <div className="w-12 h-1 bg-art-gold mx-auto mb-6 rounded-full" />
          <p className="text-art-text-muted font-sans text-sm sm:text-base leading-relaxed">
            印尼跨越赤道，擁有一萬七千多座島嶼及數十座活火山。極高海拔的肥沃火山灰土壤、充沛的雨林氣候，與島民傳統製豆處理法，交織出最豐富迷人的咖啡地圖。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Column (Left) */}
          <div className="lg:col-span-7 bg-white border border-art-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[0_4px_20px_rgba(44,36,30,0.02)]">
            <div className="absolute inset-0 bg-art-card-alt/30 pointer-events-none" />
            
            {/* Map title bar */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-art-gold animate-pulse" />
                <span className="font-serif font-medium text-art-text-heading text-sm tracking-widest">
                  印尼精品咖啡產地交互地圖
                </span>
              </div>
              <span className="text-[10px] font-mono text-art-text-subtle tracking-widest uppercase">
                Interactive Map
              </span>
            </div>

            {/* Custom SVG Map & Markers */}
            <div className="relative w-full h-80 sm:h-96 border border-art-border bg-art-bg/50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
              {/* Abstract Island Outlines */}
              <svg className="w-full h-full opacity-35 text-art-gold-light/40" viewBox="0 0 800 400" fill="currentColor">
                {/* Sumatra */}
                <path d="M50,100 L120,60 L280,180 L220,240 L100,160 Z" />
                {/* Java */}
                <path d="M220,260 L420,260 L420,290 L220,290 Z" />
                {/* Bali */}
                <path d="M430,265 L465,265 L465,285 L430,285 Z" />
                {/* Lombok & Flores */}
                <path d="M475,268 L600,268 L600,288 L475,288 Z" />
                {/* Sulawesi */}
                <path d="M410,100 L490,90 L490,140 L450,150 L460,210 L430,210 L430,130 Z" />
              </svg>

              {/* Real SVG Grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Geographic labels */}
              <div className="absolute top-4 left-6 text-[10px] font-mono text-art-text-subtle tracking-wider">
                PACIFIC OCEAN
              </div>
              <div className="absolute bottom-4 left-6 text-[10px] font-mono text-art-text-subtle tracking-wider">
                INDIAN OCEAN
              </div>

              {/* Region Markers */}
              {INDONESIAN_REGIONS.map((region) => {
                const pos = markerPositions[region.id] || { top: "50%", left: "50%" };
                const isSelected = selectedRegion.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className="absolute cursor-pointer group"
                    style={{ top: pos.top, left: pos.left }}
                    id={`map-marker-${region.id}`}
                  >
                    {/* Ring Pulse */}
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-art-gold opacity-20 ${
                        isSelected ? "opacity-40" : "group-hover:opacity-30"
                      }`} />
                      <span className={`absolute inline-flex rounded-full h-4 w-4 transition-all duration-300 ${
                        isSelected ? "bg-art-gold scale-125" : "bg-art-border-dark hover:bg-art-gold scale-100"
                      }`} />
                      <span className="absolute text-[10px] text-art-text font-serif font-bold pointer-events-none mt-10 whitespace-nowrap bg-white border border-art-border px-1.5 py-0.5 rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                        {region.name.split(" ")[0]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick selectors below map */}
            <div className="mt-6 flex flex-wrap gap-2 relative z-10">
              {INDONESIAN_REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-2 rounded-xl text-xs tracking-wider border transition-all duration-300 cursor-pointer ${
                    selectedRegion.id === region.id
                      ? "border-art-gold bg-art-gold/10 text-art-gold font-medium"
                      : "border-art-border bg-art-card hover:bg-art-card-alt text-art-text-muted"
                  }`}
                  id={`region-btn-${region.id}`}
                >
                  {region.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Details Column (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-art-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-[0_4px_20px_rgba(44,36,30,0.02)]"
              >
                {/* Region Title and Island */}
                <div>
                  <div className="flex items-center space-x-2.5 mb-2">
                    <span className="w-1.5 h-6 bg-art-gold rounded-full" />
                    <span className="text-art-text-subtle text-xs font-mono tracking-widest uppercase">
                      {selectedRegion.island}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-art-text-heading mb-4">
                    {selectedRegion.name}
                  </h3>
                  <p className="text-art-text-muted font-sans text-sm leading-relaxed mb-6">
                    {selectedRegion.description}
                  </p>

                  {/* Terroir spec grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-art-border py-5 mb-6 text-xs font-sans">
                    <div>
                      <span className="text-art-text-subtle block mb-1">生長海拔</span>
                      <span className="text-art-text font-medium font-mono">{selectedRegion.elevation}</span>
                    </div>
                    <div>
                      <span className="text-art-text-subtle block mb-1">典型處理法</span>
                      <span className="text-art-gold font-semibold">{selectedRegion.processingTradition}</span>
                    </div>
                    <div className="col-span-2 border-t border-art-border pt-4">
                      <span className="text-art-text-subtle block mb-1">火山土質</span>
                      <span className="text-art-text font-medium">{selectedRegion.soil}</span>
                    </div>
                  </div>

                  {/* Flavor Summary Bar */}
                  <div className="mb-6 p-3.5 rounded-xl bg-art-card-alt border border-art-gold/15">
                    <div className="flex items-center space-x-2 text-art-gold mb-1">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs font-serif font-bold tracking-wider">代表風味</span>
                    </div>
                    <p className="text-xs text-art-text leading-relaxed font-sans">{selectedRegion.flavorProfileSummary}</p>
                  </div>
                </div>

                {/* Flavor Sliders */}
                <div>
                  <h4 className="text-xs font-serif text-art-text-muted tracking-widest uppercase mb-4 flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-art-gold" />
                    <span>產區風味雷達指針</span>
                  </h4>
                  <div className="space-y-3 font-sans">
                    {[
                      { label: "香氣 Aroma", val: selectedRegion.aroma },
                      { label: "果酸 Acidity", val: selectedRegion.acidity },
                      { label: "醇厚度 Body", val: selectedRegion.body },
                      { label: "甘甜度 Sweetness", val: selectedRegion.sweetness },
                      { label: "東方辛香 Spiciness", val: selectedRegion.spiciness }
                    ].map((stat, i) => (
                      <div key={i} className="text-xs">
                        <div className="flex justify-between text-art-text-subtle mb-1">
                          <span>{stat.label}</span>
                          <span className="font-mono text-art-gold font-bold">{stat.val} / 5</span>
                        </div>
                        <div className="h-1 bg-art-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.val / 5) * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="h-full bg-art-gold rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
