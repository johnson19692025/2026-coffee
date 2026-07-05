import { ShoppingBag, Coffee, Compass, Brain, Timer, Logs } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart }: NavbarProps) {
  const menuItems = [
    { id: "terroir", label: "印尼火山產區", icon: Compass },
    { id: "catalog", label: "精品咖啡豆", icon: Coffee },
    { id: "consultant", label: "AI 智能選品", icon: Brain },
    { id: "brewing", label: "職人手沖助手", icon: Timer },
    { id: "roastlog", label: "最新烘焙日誌", icon: Logs },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-art-bg/90 backdrop-blur-md border-b border-art-border text-art-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("terroir")}>
            <div className="w-10 h-10 rounded-full border border-art-gold/50 bg-art-card-alt flex items-center justify-center text-art-gold shadow-[0_2px_10px_rgba(197,160,89,0.1)]">
              <span className="font-serif font-bold text-lg tracking-wider">Y</span>
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-widest text-art-text-heading block">老楊咖啡</span>
              <span className="text-[10px] tracking-widest text-art-gold font-mono block -mt-1 uppercase">Boutique Roastery</span>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden lg:flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 text-sm tracking-wider transition-colors duration-300 relative py-2 ${
                    isActive ? "text-art-gold" : "text-art-text-muted hover:text-art-text-heading"
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-art-gold"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section: Shopping Cart */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full border border-art-border bg-art-card-alt hover:bg-white hover:border-art-gold/50 text-art-text-muted hover:text-art-gold transition-all duration-300 cursor-pointer"
              id="open-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-art-gold text-[10px] font-bold text-white shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav Links - Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-art-bg/95 border-t border-art-border py-2 px-2 z-50 flex justify-around">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-2.5 rounded-xl transition-all duration-300 ${
                isActive ? "text-art-gold bg-art-card-alt" : "text-art-text-subtle"
              }`}
              id={`mobile-nav-item-${item.id}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium tracking-wider">{item.label.substring(0, 4)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
