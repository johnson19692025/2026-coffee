import { motion } from "motion/react";
import { ROAST_BATCH_LOGS } from "../data";
import { Logs, Calendar, Flame, Award, ShieldCheck, Cpu } from "lucide-react";

export default function RoastLogList() {
  return (
    <section className="py-24 bg-art-bg text-art-text border-t border-art-border" id="roastlog-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-art-gold font-mono text-xs tracking-widest uppercase block mb-3">Roaster Logs</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-art-text-heading mb-4">
            職人烘焙批次日誌
          </h2>
          <div className="w-12 h-1 bg-art-gold mx-auto mb-6 rounded-full" />
          <p className="text-art-text-muted font-sans text-sm sm:text-base leading-relaxed">
            這是一份完全公開透明的烘焙記錄。我們忠實記載每一批生豆的脫水減率、一爆發育時間（DTR），與烘焙師風味評鑑，這是我們對烘焙工藝的極致承諾。
          </p>
        </div>

        {/* Quality Commitment Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: ShieldCheck,
              title: "新鮮度保證 Freshness",
              desc: "堅持接單後烘焙。每一包咖啡袋皆標註烘焙日期，並配有單向排氣閥，保證呈現最完整的活性香氣。"
            },
            {
              icon: Flame,
              title: "烘焙曲線優化 Profiling",
              desc: "利用烘焙監測系統精準調控熱風配比。每一款印尼單品豆皆經歷 20 次以上的測試杯測，才定稿其最佳曲線。"
            },
            {
              icon: Award,
              title: "杯測篩選 Cupping Test",
              desc: "所有出廠批次皆由理查親自進行品飲杯測（Cupping），唯有風味評分達 84 分以上才獲准封裝出貨。"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-art-border text-xs font-sans space-y-3 shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-art-gold/10 text-art-gold flex items-center justify-center border border-art-gold/25">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-serif font-bold text-art-text-heading text-sm">{item.title}</h4>
                <p className="text-art-text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Logs list loop */}
        <div className="space-y-6">
          {ROAST_BATCH_LOGS.map((batch, idx) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
              className="p-6 rounded-3xl bg-white border border-art-border flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-art-gold/30 transition-all duration-300 shadow-[0_2px_12px_rgba(44,36,30,0.01)]"
              id={`roast-batch-${batch.id}`}
            >
              {/* Batch identity left block */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-art-gold px-2.5 py-1 rounded-full bg-art-gold/10 border border-art-gold/20">
                    {batch.batchNumber}
                  </span>
                  <span className="text-art-border text-xs font-mono">•</span>
                  <span className="text-art-text-subtle text-xs font-sans flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-art-text-subtle" />
                    {batch.roastDate} 烘焙
                  </span>
                </div>

                <h3 className="font-serif font-bold text-art-text-heading text-base">
                  {batch.beanName}
                </h3>

                <p className="text-art-text-muted text-xs leading-relaxed font-sans font-light max-w-xl">
                  <span className="text-art-gold font-bold block mb-1">風味評鑑筆記</span>
                  {batch.notes}
                </p>
              </div>

              {/* Stats parameters right block */}
              <div className="w-full md:w-auto md:min-w-64 flex flex-col justify-between self-stretch bg-art-card-alt p-4.5 rounded-2xl border border-art-border text-xs font-mono space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-art-text-subtle block mb-0.5">脫水率 Moisture Loss</span>
                    <span className="text-art-text-heading font-bold">{batch.moistureLoss}</span>
                  </div>
                  <div>
                    <span className="text-art-text-subtle block mb-0.5">發育時間 DTR</span>
                    <span className="text-art-text-heading font-bold">{batch.developmentTime.split(" ")[0]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-art-border grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-art-text-subtle block mb-0.5">主烘焙師 Roaster</span>
                    <span className="text-art-text font-sans">{batch.roasterName}</span>
                  </div>
                  <div>
                    <span className="text-art-text-subtle block mb-0.5">品質評級 Quality</span>
                    <span className="text-art-gold font-sans font-bold flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 animate-pulse" />
                      {batch.qualityRating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
