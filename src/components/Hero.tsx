import { motion } from "motion/react";
import { Coffee, ChevronRight, Award } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onExploreAI: () => void;
}

export default function Hero({ onExplore, onExploreAI }: HeroProps) {
  return (
    <header className="relative w-full min-h-screen bg-art-bg flex flex-col lg:flex-row items-stretch overflow-hidden pt-20">
      {/* Left Column: Content Area */}
      <div className="w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 flex flex-col justify-center items-start gap-6 z-10 bg-art-bg">
        {/* Quality Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-3 py-1 border border-art-gold text-art-gold text-xs font-sans tracking-[0.2em] uppercase mb-2 font-semibold"
        >
          SINCE 1984 • YANGS COFFEE
        </motion.div>

        {/* Brand Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-art-text-heading font-bold tracking-tight leading-[1.15]"
        >
          尋回印尼活火山的 <br />
          <span className="italic text-art-gold font-normal">
            原始風土與職人靈魂
          </span>
        </motion.h1>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-art-text-muted text-base sm:text-lg max-w-lg font-sans leading-relaxed tracking-wide"
        >
          從蘇門答臘深沉幽遠的濕剝草本、蘇拉威西薩潘山的細緻辛香，至巴里島金塔馬尼火山的奔放熱帶水果蜜香。
          我們以老楊精品烘豆師的精湛美學，為您還原最純粹的印尼精品豆魅力。
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto bg-art-text-heading text-white px-8 py-4 font-sans text-sm tracking-widest hover:bg-art-gold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group rounded-none"
            id="hero-explore-catalog-btn"
          >
            <Coffee className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span>嚴選印尼咖啡豆</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreAI}
            className="w-full sm:w-auto border border-art-text-heading px-8 py-4 font-sans text-sm tracking-widest hover:bg-art-text-heading hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer rounded-none text-art-text-heading"
            id="hero-explore-ai-btn"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-art-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-art-gold"></span>
            </span>
            <span>AI 智能風味選品</span>
          </button>
        </motion.div>
      </div>

      {/* Right Column: Visual Gallery Card */}
      <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center bg-art-bg-alt border-l border-art-border">
        <div className="h-[450px] sm:h-[550px] lg:h-full w-full bg-[#1a1612] rounded-tl-[100px] shadow-xl relative overflow-hidden group border border-art-border/30 flex items-end">
          {/* Background Image inside right panel */}
          <img
            src="/src/assets/images/coffee_hero_banner_1783060482998.jpg"
            alt="精品手沖咖啡背景"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120e0a] via-[#1a1612]/30 to-[#1a1612]/50" />

          {/* Decorative circular element from Design HTML */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-white rounded-full"></div>
          </div>

          {/* Featured Product Glass Card Overlay */}
          <div className="relative m-6 sm:m-8 lg:m-10 bg-[#1a1612]/60 backdrop-blur-md p-6 sm:p-8 border border-white/15 text-white w-full">
            <div className="text-art-gold text-xs font-sans tracking-widest mb-1 italic">Featured Origin</div>
            <h3 className="text-2xl sm:text-3xl text-white mb-2 font-serif font-bold">亞齊 加尤山 G1</h3>
            <p className="text-white/80 text-xs sm:text-sm font-sans mb-4">風味：黑巧克力、草本、雪松、奶油感、回甘強烈</p>
            <div className="h-[1px] w-full bg-white/10 my-3"></div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] sm:text-xs opacity-60 block font-sans">烘焙度：中深烘焙</span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-art-gold">NT$ 580 <span className="text-xs text-white/50 font-sans font-light">/ 227g</span></span>
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs font-mono tracking-tighter uppercase">WET-HULLED PROCESS</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
