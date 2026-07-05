import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COFFEE_BEANS } from "../data";
import { CoffeeBean } from "../types";
import { Coffee, Flame, Scale, Check, ShoppingBag, X, Award, Eye, Settings2 } from "lucide-react";

interface BeanCatalogProps {
  onAddToCart: (bean: CoffeeBean, weight: "227g" | "454g", grind: any) => void;
}

export default function BeanCatalog({ onAddToCart }: BeanCatalogProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedRoast, setSelectedRoast] = useState<string>("all");
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);

  // User configurator state for the selected modal or quick add
  const [activeWeight, setActiveWeight] = useState<"227g" | "454g">("227g");
  const [activeGrind, setActiveGrind] = useState<string>("整豆 (不代磨)");
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const grindOptions = [
    "整豆 (不代磨)",
    "手沖研磨",
    "義式研磨",
    "摩卡壺研磨",
    "法壓壺研磨",
  ];

  // Filtering beans
  const filteredBeans = COFFEE_BEANS.filter((bean) => {
    const regionMatch = selectedRegion === "all" || bean.id.includes(selectedRegion);
    const roastMatch = selectedRoast === "all" || bean.roastLevel === selectedRoast;
    return regionMatch && roastMatch;
  });

  const handleOpenDetail = (bean: CoffeeBean) => {
    setSelectedBean(bean);
    setActiveWeight("227g");
    setActiveGrind("整豆 (不代磨)");
  };

  const handleQuickAdd = (bean: CoffeeBean, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(bean, "227g", "整豆 (不代磨)");
    triggerAddedNotification(bean.name);
  };

  const triggerAddedNotification = (name: string) => {
    setAddedNotification(name);
    setTimeout(() => {
      setAddedNotification(null);
    }, 2500);
  };

  const handleModalAdd = () => {
    if (selectedBean) {
      onAddToCart(selectedBean, activeWeight, activeGrind);
      triggerAddedNotification(selectedBean.name);
      setSelectedBean(null);
    }
  };

  return (
    <section className="py-24 bg-art-card-alt text-art-text border-t border-art-border" id="catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-art-gold font-mono text-xs tracking-widest uppercase block mb-3">Selected Beans</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-art-text-heading mb-4">
            老楊精品烘焙生豆目錄
          </h2>
          <div className="w-12 h-1 bg-art-gold mx-auto mb-6 rounded-full" />
          <p className="text-art-text-muted font-sans text-sm sm:text-base leading-relaxed">
            我們親自走訪印尼各莊園，嚴格篩選瑕疵、杯測評分，並在台灣進行小量、精準烘焙。以極致的細節呈現單一源頭火山精品豆。
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-art-border pb-8">
          {/* Region filter */}
          <div>
            <span className="text-xs text-art-text-subtle font-mono tracking-widest uppercase block mb-3">產區島嶼</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "全部產區" },
                { id: "sumatra", label: "蘇門答臘" },
                { id: "sulawesi", label: "蘇拉威西" },
                { id: "bali", label: "巴里島" },
                { id: "java", label: "爪哇" },
                { id: "flores", label: "弗洛勒斯" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRegion(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedRegion === filter.id
                      ? "bg-art-gold text-white font-medium shadow-md"
                      : "bg-white border border-art-border text-art-text-muted hover:text-art-text-heading"
                  }`}
                  id={`filter-region-${filter.id}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roast level filter */}
          <div>
            <span className="text-xs text-art-text-subtle font-mono tracking-widest uppercase block mb-3">烘焙程度</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "全部焙度" },
                { id: "light-medium", label: "淺中焙" },
                { id: "medium", label: "中焙" },
                { id: "medium-dark", label: "中深焙" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRoast(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedRoast === filter.id
                      ? "bg-art-gold text-white font-medium shadow-md"
                      : "bg-white border border-art-border text-art-text-muted hover:text-art-text-heading"
                  }`}
                  id={`filter-roast-${filter.id}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeans.map((bean) => (
            <div
              key={bean.id}
              onClick={() => handleOpenDetail(bean)}
              className="group bg-white border border-art-border hover:border-art-gold/50 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col h-full hover:shadow-[0_12px_24px_rgba(44,36,30,0.06)] relative"
              id={`bean-card-${bean.id}`}
            >
              {/* Image Container with tag */}
              <div className="relative aspect-square w-full bg-art-bg-alt overflow-hidden">
                <img
                  src={bean.image}
                  alt={bean.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120e0a]/40 via-transparent to-transparent opacity-60" />

                {/* Processing Tag */}
                <span className="absolute top-4 left-4 bg-white/95 border border-art-border text-art-text-heading text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full uppercase font-medium">
                  {bean.processing}
                </span>

                {/* Roast tag */}
                <span className="absolute top-4 right-4 bg-art-gold text-white text-[10px] font-sans tracking-widest px-2.5 py-1 rounded-full">
                  {bean.roastLevelText.split(" ")[0]}
                </span>
              </div>

              {/* Bean Info */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] tracking-widest text-art-text-subtle font-mono block uppercase mb-1.5">
                    {bean.region}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-art-text-heading mb-2 leading-snug group-hover:text-art-gold transition-colors duration-300">
                    {bean.name}
                  </h3>
                  <p className="text-art-text-muted font-sans text-xs leading-relaxed line-clamp-2 mb-4">
                    {bean.description}
                  </p>

                  {/* Flavor Notes badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {bean.flavorNotes.slice(0, 3).map((note, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-art-bg text-art-text-muted border border-art-border"
                      >
                        {note}
                      </span>
                    ))}
                    {bean.flavorNotes.length > 3 && (
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-art-bg text-art-text-subtle">
                        +{bean.flavorNotes.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing and Action row */}
                <div className="flex items-center justify-between border-t border-art-border pt-4 mt-auto">
                  <div>
                    <span className="text-[10px] text-art-text-subtle block">NT$ / 227g (半磅)</span>
                    <span className="text-lg font-mono font-bold text-art-gold">NT$ {bean.priceHalfPound}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(bean);
                      }}
                      className="p-2.5 rounded-xl border border-art-border bg-art-bg hover:border-art-gold text-art-text-muted hover:text-art-gold transition-all duration-300"
                      title="詳細規格"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(bean, e)}
                      className="px-4 py-2.5 rounded-xl bg-art-gold hover:bg-art-gold-dark text-white font-medium text-xs tracking-wider transition-all duration-300 flex items-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>加到購物車</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel Modal */}
        <AnimatePresence>
          {selectedBean && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBean(null)}
                className="fixed inset-0 bg-art-text-heading/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white border border-art-border w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedBean(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 border border-art-border text-art-text-muted hover:text-art-text-heading transition-colors cursor-pointer shadow-sm"
                  id="close-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Side: Coffee Image & specs */}
                <div className="md:col-span-5 relative bg-art-bg flex flex-col justify-between border-r border-art-border">
                  <div className="relative aspect-square md:aspect-auto md:h-80 lg:h-96 w-full">
                    <img
                      src={selectedBean.image}
                      alt={selectedBean.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-art-bg via-transparent to-transparent" />
                  </div>

                  {/* Quality indicators inside left column */}
                  <div className="p-6 space-y-4 text-xs font-sans">
                    <div>
                      <span className="text-art-text-subtle block mb-1">生豆等級</span>
                      <span className="text-art-text font-medium font-mono flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-art-gold" />
                        {selectedBean.grade}
                      </span>
                    </div>
                    <div>
                      <span className="text-art-text-subtle block mb-1">莊園海拔</span>
                      <span className="text-art-text font-medium font-mono">{selectedBean.elevation}</span>
                    </div>
                    <div>
                      <span className="text-art-text-subtle block mb-1">印尼產區詳情</span>
                      <span className="text-art-text font-medium">{selectedBean.region}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Configuration & Story */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
                  <div>
                    {/* Header Spec */}
                    <div className="flex items-center space-x-2.5 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-art-gold/10 border border-art-gold/20 text-[10px] font-mono tracking-widest text-art-gold uppercase font-medium">
                        {selectedBean.processing}
                      </span>
                      <span className="text-art-text-subtle text-xs font-mono">•</span>
                      <span className="text-art-text-muted text-xs font-mono">{selectedBean.roastLevelText}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-art-text-heading mb-1 leading-snug">
                      {selectedBean.name}
                    </h3>
                    <p className="text-art-text-subtle font-mono text-xs tracking-wider mb-4 border-b border-art-border pb-3 uppercase">
                      {selectedBean.englishName}
                    </p>

                    {/* Descriptive Story */}
                    <div className="space-y-4 mb-6">
                      <p className="text-art-text-muted text-sm leading-relaxed font-sans">
                        {selectedBean.description}
                      </p>
                      <div className="p-4 rounded-xl bg-art-card-alt border border-art-border">
                        <span className="text-art-gold font-serif text-[11px] font-bold tracking-wider uppercase block mb-1">
                          烘豆師尋味札記
                        </span>
                        <p className="text-art-text-muted text-xs leading-relaxed font-sans">
                          {selectedBean.story}
                        </p>
                      </div>
                    </div>

                    {/* Taste Radar stats */}
                    <div className="grid grid-cols-5 gap-2 text-center mb-6 py-4 border-t border-b border-art-border">
                      {[
                        { label: "香氣", value: selectedBean.aroma },
                        { label: "果酸", value: selectedBean.acidity },
                        { label: "醇厚", value: selectedBean.body },
                        { label: "甘甜", value: selectedBean.sweetness },
                        { label: "平衡", value: selectedBean.balance },
                      ].map((st, i) => (
                        <div key={i} className="text-xs">
                          <span className="text-art-text-subtle block mb-1.5">{st.label}</span>
                          <div className="flex justify-center space-x-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  star <= st.value ? "bg-art-gold" : "bg-art-border"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Flavor notes tag catalog */}
                    <div className="mb-8">
                      <span className="text-xs text-art-text-subtle block mb-2 font-mono">杯測風味輪特徵</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedBean.flavorNotes.map((note, i) => (
                          <span
                            key={i}
                            className="text-xs font-sans px-3.5 py-1.5 rounded-xl bg-art-bg text-art-text border border-art-border flex items-center space-x-1"
                          >
                            <Coffee className="w-3.5 h-3.5 text-art-gold" />
                            <span>{note}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Product Weights selectors */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-xs text-art-text-subtle block mb-2 font-mono">規格重量</label>
                        <div className="flex space-x-2">
                          {[
                            { id: "227g", label: "227g (半磅)", price: selectedBean.priceHalfPound },
                            { id: "454g", label: "454g (一磅)", price: selectedBean.priceOnePound }
                          ].map((wt) => (
                            <button
                              key={wt.id}
                              onClick={() => setActiveWeight(wt.id as any)}
                              className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider border text-center transition-all cursor-pointer ${
                                activeWeight === wt.id
                                  ? "border-art-gold bg-art-gold/10 text-art-gold font-medium"
                                  : "border-art-border text-art-text-subtle hover:text-art-text-muted"
                              }`}
                            >
                              {wt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Grind selector */}
                      <div>
                        <label className="text-xs text-art-text-subtle block mb-2 font-mono flex items-center gap-1">
                          <Settings2 className="w-3.5 h-3.5 text-art-gold" />
                          <span>研磨設定</span>
                        </label>
                        <select
                          value={activeGrind}
                          onChange={(e) => setActiveGrind(e.target.value)}
                          className="w-full py-2.5 px-3 rounded-xl text-xs border border-art-border bg-white text-art-text focus:outline-none focus:border-art-gold transition-colors"
                        >
                          {grindOptions.map((gr, idx) => (
                            <option key={idx} value={gr}>
                              {gr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart checkout bar */}
                  <div className="border-t border-art-border pt-6 mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-art-text-subtle block">單價總計</span>
                      <span className="text-2xl font-mono font-bold text-art-gold">
                        NT$ {activeWeight === "227g" ? selectedBean.priceHalfPound : selectedBean.priceOnePound}
                      </span>
                    </div>

                    <button
                      onClick={handleModalAdd}
                      className="px-8 py-3.5 bg-art-text-heading hover:bg-art-gold text-white font-medium text-sm tracking-wider shadow-md transition-all duration-300 flex items-center space-x-2 cursor-pointer rounded-none"
                      id="add-to-cart-modal-btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>放入職人購物車</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {addedNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 right-4 z-50 bg-white border border-art-gold/50 text-art-text px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3.5 pr-12 max-w-md"
            >
              <div className="w-8 h-8 rounded-full bg-art-gold/10 text-art-gold flex items-center justify-center border border-art-gold/20 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-art-text-subtle font-mono tracking-wider block">購物車通知</span>
                <p className="text-xs text-art-text-muted font-sans font-medium line-clamp-1">
                  已成功將 <span className="text-art-gold">{addedNotification}</span> 加入購物清單
                </p>
              </div>
              <button
                onClick={() => setAddedNotification(null)}
                className="absolute right-3.5 top-3.5 text-art-text-subtle hover:text-art-text transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
