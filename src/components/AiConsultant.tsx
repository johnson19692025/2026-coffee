import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COFFEE_BEANS } from "../data";
import { CoffeeBean } from "../types";
import { Brain, Send, RotateCcw, Sparkles, Check, Flame, HelpCircle } from "lucide-react";

interface AiConsultantProps {
  onAddToCart: (bean: CoffeeBean, weight: "227g" | "454g", grind: any) => void;
}

export default function AiConsultant({ onAddToCart }: AiConsultantProps) {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presetPrompts = [
    "我喜歡醇厚濃郁、幾乎不酸的口感，常喝黑咖啡，喜歡巧克力和焦糖餘韻。",
    "我愛水果風味！希望酸甜度像熱帶水果一樣奔放，沖出來有豐富的花果香氣。",
    "我想找一款平衡、溫和，下午喝了很舒服，帶有堅果香且甜感極高的印尼豆。",
    "打算拿來煮義式拿鐵，希望加牛奶後巧克力甜感很突出、口感飽滿。"
  ];

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setUserInput(queryText);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/coffee-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          currentBeans: COFFEE_BEANS.map(b => ({
            id: b.id,
            name: b.name,
            region: b.region,
            processing: b.processing,
            roastLevel: b.roastLevelText,
            flavorNotes: b.flavorNotes,
            description: b.description,
            priceHalfPound: b.priceHalfPound
          }))
        })
      });

      if (!response.ok) {
        throw new Error("伺服器繁忙，請稍後再試。");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "風味顧問系統目前正在烘焙咖啡，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecommended = (beanId: string) => {
    const matchedBean = COFFEE_BEANS.find(b => b.id === beanId);
    if (matchedBean) {
      onAddToCart(matchedBean, "227g", "整豆 (不代磨)");
    }
  };

  return (
    <section className="py-24 bg-art-bg text-art-text" id="consultant-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-art-gold font-mono text-xs tracking-widest uppercase block mb-3">AI Flavor Consultant</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-art-text-heading mb-4">
            AI 智能咖啡風味選品
          </h2>
          <div className="w-12 h-1 bg-art-gold mx-auto mb-6 rounded-full" />
          <p className="text-art-text-muted font-sans text-sm sm:text-base leading-relaxed">
            與我們的 AI 烘豆師進行對話。告訴他您的口感偏好、萃取器具或飲用習慣，他將為您精準匹配最具契合度的印尼精品豆與專業沖煮方案。
          </p>
        </div>

        {/* Console Box */}
        <div className="bg-white border border-art-border rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(44,36,30,0.03)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-art-gold" />

          {!result && !isLoading ? (
            /* Prompt Input Screen */
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5 text-art-text-heading">
                <Brain className="w-5 h-5 text-art-gold" />
                <span className="font-serif font-medium tracking-wide text-sm">輸入您的口感描述</span>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="請在此處描述您的喜好... 例如：『我喜歡幾乎沒有酸味的手沖咖啡，口感像熱帶水果一樣厚實，希望有極致太妃糖的甘甜尾韻。』"
                  className="w-full h-36 p-4 rounded-xl bg-art-card-alt border border-art-border focus:border-art-gold focus:outline-none text-art-text text-sm leading-relaxed placeholder-art-text-subtle/50 transition-colors resize-none"
                  id="consultant-textarea"
                />
                <button
                  onClick={() => handleQuery(userInput)}
                  disabled={!userInput.trim()}
                  className="absolute bottom-4 right-4 p-3 rounded-none bg-art-text-heading hover:bg-art-gold text-white disabled:bg-art-border disabled:text-art-text-subtle/60 transition-colors cursor-pointer"
                  id="consultant-submit-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Preset selectors */}
              <div>
                <span className="text-xs text-art-text-subtle font-mono block mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-art-gold" />
                  <span>試試以下熱門口感偏好：</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {presetPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuery(prompt)}
                      className="text-left p-3.5 rounded-xl border border-art-border bg-white hover:bg-art-card-alt hover:border-art-gold/30 text-art-text-muted hover:text-art-text-heading text-xs leading-relaxed transition-all duration-300 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            /* Loading screen with artisanal quotes */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center h-16 w-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-art-gold/20" />
                <div className="h-10 w-10 rounded-full border-2 border-art-gold border-t-transparent animate-spin" />
                <Sparkles className="absolute w-4 h-4 text-art-gold" />
              </div>
              <div>
                <span className="text-art-gold font-serif text-sm tracking-widest uppercase block animate-pulse font-bold">
                  AI 烘豆師正細緻杯測中...
                </span>
                <p className="text-art-text-subtle text-xs font-sans mt-2 max-w-sm mx-auto leading-relaxed italic">
                  「我們正在將您的味蕾描述與蘇門答臘、蘇拉威西火山高地的微氣候進行風味譜匹配。」
                </p>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Query Summary header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-art-border pb-4 gap-4">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-5 h-5 text-art-gold" />
                  <div>
                    <span className="text-[10px] text-art-text-subtle font-mono tracking-widest block">AI RECOMMENDATION MATCH</span>
                    <span className="font-serif text-sm text-art-text-heading font-medium line-clamp-1">
                      『 {userInput} 』
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setUserInput("");
                  }}
                  className="px-4 py-2 rounded-xl border border-art-border bg-white hover:bg-art-card-alt hover:text-art-text-heading text-art-text-muted text-xs font-medium tracking-wide transition-colors flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                  id="consultant-reset-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新配對</span>
                </button>
              </div>

              {/* Suggestions Cards loop */}
              <div className="space-y-6">
                {result.recommendations?.map((rec: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="p-6 rounded-2xl bg-art-card-alt border border-art-border flex flex-col justify-between"
                  >
                    <div>
                      {/* Match percentage ring / layout */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-art-gold animate-pulse" />
                          <h4 className="font-serif font-bold text-art-text-heading text-base">
                            {rec.beanName}
                          </h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-art-gold/15 border border-art-gold/25 text-art-gold text-xs font-mono font-bold">
                          契合度 {rec.matchPercentage}%
                        </span>
                      </div>

                      {/* Recommend description */}
                      <p className="text-art-text text-xs leading-relaxed font-sans mb-6">
                        {rec.reason}
                      </p>

                      {/* Exquisite Brewing spec */}
                      {rec.brewGuide && (
                        <div className="p-4 rounded-xl bg-white border border-art-border text-art-text text-xs font-sans space-y-3">
                          <span className="text-art-gold font-serif font-bold tracking-wider uppercase block border-b border-art-border pb-1.5">
                            職人專屬沖煮指引
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <span className="text-art-text-subtle block mb-0.5">建議粉水比</span>
                              <span className="text-art-text font-medium font-mono">{rec.brewGuide.ratio}</span>
                            </div>
                            <div>
                              <span className="text-art-text-subtle block mb-0.5">最佳水溫</span>
                              <span className="text-art-text font-medium font-mono">{rec.brewGuide.waterTemp}</span>
                            </div>
                            <div>
                              <span className="text-art-text-subtle block mb-0.5">推薦研磨度</span>
                              <span className="text-art-gold font-semibold">{rec.brewGuide.grindSize}</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-art-border text-art-text-muted leading-relaxed text-[11px]">
                            <span className="text-art-text-subtle block mb-1 font-medium">注水工法步驟</span>
                            {rec.brewGuide.pouringStep}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick checkout add */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleAddRecommended(rec.beanId)}
                        className="px-5 py-2.5 rounded-none bg-art-text-heading hover:bg-art-gold text-white font-medium text-xs tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>直接放入購物車 (NT$ 227g)</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Overall wisdom summary */}
              {result.overallAdvice && (
                <div className="p-4.5 rounded-xl bg-art-card-alt border border-art-gold/15 text-xs font-sans leading-relaxed text-art-text flex items-start gap-2.5">
                  <Flame className="w-5 h-5 text-art-gold shrink-0" />
                  <div>
                    <span className="text-art-gold font-serif font-bold tracking-wider uppercase block mb-1">
                      烘焙總監私房叮嚀
                    </span>
                    {result.overallAdvice}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-sans mt-4 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
