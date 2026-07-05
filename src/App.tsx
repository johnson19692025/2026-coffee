import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TerroirMap from "./components/TerroirMap";
import BeanCatalog from "./components/BeanCatalog";
import AiConsultant from "./components/AiConsultant";
import BrewingStation from "./components/BrewingStation";
import RoastLogList from "./components/RoastLogList";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { CoffeeBean, CartItem, Order } from "./types";
import { Coffee, MapPin, Award } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("terroir");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const handleAddToCart = (bean: CoffeeBean, weight: "227g" | "454g", grind: any) => {
    setCart((prevCart) => {
      // Find matching item by bean id, weight, and grind type
      const existingIdx = prevCart.findIndex(
        (item) => item.bean.id === bean.id && item.weight === weight && item.grind === grind
      );

      const price = weight === "227g" ? bean.priceHalfPound : bean.priceOnePound;

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { bean, weight, grind, quantity: 1, price }];
      }
    });
  };

  const handleUpdateCartItemQuantity = (idx: number, delta: number) => {
    setCart((prevCart) => {
      const item = prevCart[idx];
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        return prevCart.filter((_, i) => i !== idx);
      } else {
        const newCart = [...prevCart];
        newCart[idx].quantity = newQuantity;
        return newCart;
      }
    });
  };

  const handleRemoveCartItem = (idx: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== idx));
  };

  const handleCheckout = (customerDetails: {
    customerName: string;
    phone: string;
    email: string;
    shippingMethod: any;
    shippingAddress: string;
    paymentMethod: any;
  }) => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 1000 ? 0 : 80;
    const total = subtotal + shippingFee;

    // Generate neat unique Order number
    const dateStr = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "").slice(0, 16);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `RC-IDN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      ...customerDetails,
      subtotal,
      shippingFee,
      total,
      status: "processing",
      orderDate: dateStr,
    };

    setCurrentOrder(newOrder);
    setCart([]); // Clear Cart
    setIsCartOpen(false); // Close Cart Drawer
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-art-bg text-art-text flex flex-col font-sans select-none pb-20 lg:pb-0">
      {/* Top sticky header menu */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Hero Showcase */}
      <Hero
        onExplore={() => {
          setActiveTab("catalog");
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onExploreAI={() => {
          setActiveTab("consultant");
          document.getElementById("consultant-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Tab content renderer switcher */}
      <main className="flex-grow">
        {activeTab === "terroir" && <TerroirMap />}
        {activeTab === "catalog" && <BeanCatalog onAddToCart={handleAddToCart} />}
        {activeTab === "consultant" && <AiConsultant onAddToCart={handleAddToCart} />}
        {activeTab === "brewing" && <BrewingStation />}
        {activeTab === "roastlog" && <RoastLogList />}
      </main>

      {/* Exquisite boutique footer */}
      <footer className="bg-white border-t border-art-border py-16 text-xs text-art-text-muted font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full border border-art-border bg-art-card-alt flex items-center justify-center text-art-gold font-serif font-bold text-sm">
                Y
              </div>
              <span className="font-serif font-bold text-art-text-heading text-sm tracking-widest">老楊印尼精品烘豆所</span>
            </div>
            <p className="leading-relaxed text-art-text-muted">
              傳承老楊咖啡 (Yang's Coffee) 職人匠心與對完美的偏執。我們深耕印尼蘇門答臘、巴里島火山高地，將自然風土化為杯中極致的香氣與底蘊。
            </p>
          </div>

          {/* Column 2: Origin terroirs */}
          <div className="space-y-3">
            <h4 className="font-serif text-art-text-heading font-bold tracking-wider text-sm">嚴選單一產區</h4>
            <ul className="space-y-2 text-art-text-subtle">
              <li className="flex items-center space-x-1.5 hover:text-art-text-heading transition-colors cursor-pointer" onClick={() => setActiveTab("terroir")}>
                <MapPin className="w-3.5 h-3.5 text-art-gold" />
                <span>蘇門答臘 亞齊加約高地</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-art-text-heading transition-colors cursor-pointer" onClick={() => setActiveTab("terroir")}>
                <MapPin className="w-3.5 h-3.5 text-art-gold" />
                <span>蘇拉威西 薩潘山</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-art-text-heading transition-colors cursor-pointer" onClick={() => setActiveTab("terroir")}>
                <MapPin className="w-3.5 h-3.5 text-art-gold" />
                <span>巴里島 金塔馬尼火山區</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-art-text-heading transition-colors cursor-pointer" onClick={() => setActiveTab("terroir")}>
                <MapPin className="w-3.5 h-3.5 text-art-gold" />
                <span>西爪哇 巽他火山高原</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quality Commitment */}
          <div className="space-y-3">
            <h4 className="font-serif text-art-text-heading font-bold tracking-wider text-sm">匠心保證</h4>
            <ul className="space-y-2 text-art-text-subtle">
              <li className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-art-gold" />
                <span>100% 精品莊園阿拉比卡豆</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-art-gold" />
                <span>接單新鮮烘焙，手工三次挑揀</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-art-gold" />
                <span>氮氣充填及單向排氣閥封裝</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-art-gold" />
                <span>單筆滿 NT$1000 享全台免運費</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3 text-art-text-subtle">
            <h4 className="font-serif text-art-text-heading font-bold tracking-wider text-sm">烘焙所資訊</h4>
            <p>客服信箱: service@yangscoffee.tw</p>
            <p>服務時間: 週一至週五 09:00 - 18:00</p>
            <p>地址: 台北市大安區極致精品烘焙路 88 號</p>
            <div className="pt-2 border-t border-art-border text-[10px] text-art-text-subtle">
              © {new Date().getFullYear()} Yang's Coffee. All rights reserved. 僅供展示與體驗。
            </div>
          </div>
        </div>
      </footer>

      {/* Floating sliding Shopping Cart Panel drawer overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Exquisite check-out receipt invoice confirmation popup */}
      <CheckoutModal
        order={currentOrder}
        onClose={() => setCurrentOrder(null)}
      />
    </div>
  );
}
