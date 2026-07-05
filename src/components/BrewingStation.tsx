import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BREWING_RECIPES } from "../data";
import { Timer, RotateCcw, Play, Pause, Flame, Info, CheckCircle2, ChevronRight } from "lucide-react";

export default function BrewingStation() {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(1); // Standard hand-brew V60
  const [coffeeWeight, setCoffeeWeight] = useState(15); // Default 15g
  const [customRatio, setCustomRatio] = useState(15); // Default 1:15

  // Interactive Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeRecipe = BREWING_RECIPES[selectedRecipeIndex];
  const targetWater = coffeeWeight * customRatio;

  // Brewing stages calculated on the fly
  const stages = [
    {
      name: "1. 悶蒸階段 (Blooming)",
      duration: 30, // 30s
      waterPercent: 0.15, // 15% of total water
      instruction: "注水至約目標值並等待，讓二氧化碳順暢排出，喚醒印尼單品火山豆深藏的水果與草本風味。"
    },
    {
      name: "2. 主力萃取 (Main Pouring)",
      duration: 60, // 60s
      waterPercent: 0.65, // up to 65% of total water
      instruction: "由內而外以同心圓細流緩慢注水。穩定水位，引出飽滿甜度、巧克力油脂與中烘焙特有的厚實感。"
    },
    {
      name: "3. 尾段注水 (Final Pouring)",
      duration: 45, // 45s
      waterPercent: 1.0, // up to 100% of water
      instruction: "平穩維持流速，輕巧注水至最終刻度，隨後停止，等待濾紙中的水分完全滴落至分享壺中。"
    }
  ];

  const totalBrewTime = stages.reduce((acc, st) => acc + st.duration, 0);

  // Determine current stage based on elapsed seconds
  useEffect(() => {
    let cumulatedTime = 0;
    let foundStage = 0;

    for (let i = 0; i < stages.length; i++) {
      cumulatedTime += stages[i].duration;
      if (elapsedSeconds < cumulatedTime) {
        foundStage = i;
        break;
      }
      if (i === stages.length - 1) {
        foundStage = stages.length; // Over
      }
    }

    setCurrentStageIndex(foundStage);
  }, [elapsedSeconds]);

  // Timer loop
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= totalBrewTime) {
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return totalBrewTime;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleStartStop = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setCurrentStageIndex(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <section className="py-24 bg-white text-art-text border-t border-art-border" id="brewing-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-art-gold font-mono text-xs tracking-widest uppercase block mb-3">Brewing Station</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-art-text-heading mb-4">
            職人手沖比例與沖煮時計
          </h2>
          <div className="w-12 h-1 bg-art-gold mx-auto mb-6 rounded-full" />
          <p className="text-art-text-muted font-sans text-sm sm:text-base leading-relaxed">
            這不僅是比例計算機，更是一台配備分段提示的手沖計時器。跟隨我們的節奏，用科學與儀式感沖煮您的印尼精品豆。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Spec Calculator Block */}
          <div className="lg:col-span-5 bg-art-card-alt border border-art-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5 text-art-text-heading">
                <Flame className="w-5 h-5 text-art-gold" />
                <span className="font-serif font-medium tracking-wide text-sm">沖煮工藝參數調整</span>
              </div>

              {/* Recipe list */}
              <div className="space-y-2">
                <span className="text-[10px] text-art-text-subtle font-mono block mb-2 uppercase tracking-wider">萃取方案預設</span>
                {BREWING_RECIPES.map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedRecipeIndex(i);
                      setCustomRatio(rec.ratio);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-300 cursor-pointer ${
                      selectedRecipeIndex === i
                        ? "border-art-gold bg-white text-art-text-heading font-medium"
                        : "border-art-border bg-white/60 text-art-text-muted hover:text-art-text-heading hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-semibold">{rec.name.split(" - ")[0]}</span>
                      <span className="font-mono text-art-gold font-bold">{rec.name.split(" - ")[1]}</span>
                    </div>
                    <p className="text-[11px] text-art-text-subtle line-clamp-1">{rec.steps}</p>
                  </button>
                ))}
              </div>

              {/* Weight Slider */}
              <div className="pt-4 border-t border-art-border">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-art-text-muted font-mono">粉量 Coffee Weight</span>
                  <span className="font-mono text-art-gold font-bold">{coffeeWeight}g</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="30"
                  step="1"
                  value={coffeeWeight}
                  onChange={(e) => setCoffeeWeight(Number(e.target.value))}
                  className="w-full h-1 bg-art-border rounded-lg appearance-none cursor-pointer accent-art-gold"
                />
              </div>

              {/* Ratio Slider */}
              <div className="pt-4 border-t border-art-border">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-art-text-muted font-mono">粉水比 Brewing Ratio</span>
                  <span className="font-mono text-art-gold font-bold">1 : {customRatio}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={customRatio}
                  onChange={(e) => setCustomRatio(Number(e.target.value))}
                  className="w-full h-1 bg-art-border rounded-lg appearance-none cursor-pointer accent-art-gold"
                />
              </div>
            </div>

            {/* Target values card */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-art-border text-xs font-sans space-y-3 relative overflow-hidden">
              <span className="text-[10px] tracking-widest font-mono text-art-text-subtle uppercase block">Calculated Result</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-art-text-muted block mb-0.5">總注水量 Target Water</span>
                  <span className="text-xl font-mono font-bold text-art-text-heading">{targetWater}g</span>
                </div>
                <div>
                  <span className="text-art-text-muted block mb-0.5">建議沖煮水溫</span>
                  <span className="text-xl font-mono font-bold text-art-gold">{activeRecipe.temp}</span>
                </div>
              </div>
              <div className="pt-2.5 border-t border-art-border flex items-start gap-1.5 text-art-text-muted text-[11px] leading-relaxed">
                <Info className="w-3.5 h-3.5 text-art-gold shrink-0 mt-0.5" />
                <p>{activeRecipe.steps}</p>
              </div>
            </div>
          </div>

          {/* Right: Live Stopwatch Timer block */}
          <div className="lg:col-span-7 bg-art-card-alt border border-art-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-art-gold/5 rounded-full filter blur-3xl pointer-events-none" />

            {/* Timer main layout */}
            <div className="text-center py-4">
              <span className="text-art-gold font-mono text-[10px] tracking-widest uppercase block mb-1">Brewing Clock</span>
              
              {/* Displayed clock */}
              <div className="font-serif text-5xl sm:text-6xl font-light tracking-wide text-art-text-heading mb-2 select-none">
                {formatTime(elapsedSeconds)}
              </div>
              
              {/* Total duration reference */}
              <span className="text-xs text-art-text-subtle font-mono tracking-wider">
                目標總時間: {formatTime(totalBrewTime)}
              </span>
            </div>

            {/* Progress segment visual */}
            <div className="my-6">
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden flex border border-art-border/30">
                {stages.map((st, idx) => {
                  const percentWidth = (st.duration / totalBrewTime) * 100;
                  // Calculate active width for this stage segment
                  let cumulatedBefore = stages.slice(0, idx).reduce((acc, s) => acc + s.duration, 0);
                  let activeWidth = 0;
                  if (elapsedSeconds > cumulatedBefore) {
                    activeWidth = Math.min(elapsedSeconds - cumulatedBefore, st.duration);
                  }
                  const fillPercent = (activeWidth / st.duration) * 100;

                  return (
                    <div
                      key={idx}
                      className="h-full border-r border-art-border last:border-0 relative"
                      style={{ width: `${percentWidth}%` }}
                    >
                      <div
                        className="h-full bg-art-gold"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active stage instructions */}
            <div className="min-h-36 flex flex-col justify-center text-center p-5 rounded-2xl bg-white border border-art-border/60 relative">
              <AnimatePresence mode="wait">
                {currentStageIndex < stages.length ? (
                  <motion.div
                    key={currentStageIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2.5"
                  >
                    <span className="px-3 py-1 rounded-full bg-art-gold/15 border border-art-gold/25 text-art-gold text-[10px] font-mono tracking-widest uppercase inline-block font-bold">
                      {stages[currentStageIndex].name}
                    </span>
                    <p className="text-xs text-art-text-muted max-w-md mx-auto leading-relaxed font-sans">
                      {stages[currentStageIndex].instruction}
                    </p>
                    
                    {/* Water flow target */}
                    <div className="pt-2 text-xs font-mono text-art-text-muted">
                      當前注水目標: <span className="text-art-gold font-bold">{Math.round(targetWater * stages[currentStageIndex].waterPercent)}g</span> / 最終 {targetWater}g
                    </div>
                  </motion.div>
                ) : (
                  /* Finished Screen */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 py-2 text-center"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-art-gold/10 text-art-gold border border-art-gold/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-art-gold font-serif text-sm font-bold tracking-widest block">
                        沖煮圓滿完成！
                      </span>
                      <p className="text-xs text-art-text-muted max-w-sm mx-auto leading-relaxed">
                        請移開濾杯。輕輕搖晃分享壺讓溫度均勻，將手沖杯溫熱，即可盡情享用這杯富含印尼火山風采的瓊漿。
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clock action controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="p-3.5 rounded-none border border-art-border bg-white text-art-text-muted hover:text-art-text-heading hover:bg-art-card-alt transition-colors cursor-pointer"
                title="重設計時"
                id="timer-reset-btn"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handleStartStop}
                className={`px-8 py-3.5 rounded-none font-medium text-sm tracking-widest transition-all duration-300 flex items-center space-x-2.5 cursor-pointer shadow-sm ${
                  isTimerRunning
                    ? "bg-white hover:bg-art-card-alt text-art-text-heading border border-art-border"
                    : "bg-art-text-heading hover:bg-art-gold text-white"
                }`}
                id="timer-play-pause-btn"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-art-text-heading" />
                    <span>暫停沖煮</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>開始注水</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
