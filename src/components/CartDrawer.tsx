import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";
import { X, Trash2, Plus, Minus, CreditCard, Truck, ShoppingBag, FileText, Check } from "lucide-react";
import React, { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (idx: number, delta: number) => void;
  onRemoveItem: (idx: number) => void;
  onCheckout: (orderDetails: {
    customerName: string;
    phone: string;
    email: string;
    shippingMethod: any;
    shippingAddress: string;
    paymentMethod: any;
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"超商取貨 (7-11/全家)" | "黑貓低溫宅配" | "郵寄到府">("超商取貨 (7-11/全家)");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"信用卡線上刷卡" | "ATM 轉帳" | "超商取貨付款">("超商取貨付款");

  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 1000;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 80;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError("您的購物車是空的，無法結帳。");
      return;
    }

    if (!customerName.trim() || !phone.trim() || !shippingAddress.trim()) {
      setFormError("請填寫所有必要聯絡與收件資訊。");
      return;
    }

    onCheckout({
      customerName,
      phone,
      email: email || "未提供",
      shippingMethod,
      shippingAddress,
      paymentMethod,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-art-bg border-l border-art-border text-art-text flex flex-col h-full shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-art-border flex items-center justify-between bg-white">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-art-gold" />
                  <span className="font-serif font-bold text-lg tracking-wider text-art-text-heading">
                    精品購物車
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-none border border-art-border hover:border-art-gold hover:text-art-text-heading text-art-text-muted transition-all cursor-pointer bg-white"
                  id="close-cart-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-art-text-subtle">
                    <ShoppingBag className="w-12 h-12 mb-4 text-art-border" />
                    <p className="text-sm font-sans font-medium text-art-text-muted">購物車空空如也</p>
                    <p className="text-xs mt-1 text-art-text-subtle">選購一些高地火山咖啡豆，開啟美妙清晨吧！</p>
                  </div>
                ) : (
                  <>
                    {/* Free shipping progress indicator */}
                    <div className="p-4 rounded-xl bg-white border border-art-border text-xs text-art-text-muted">
                      {isFreeShipping ? (
                        <div className="flex items-center gap-2 text-art-gold font-medium">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>已達成滿 NT$1000 門檻！本次訂單享有<b>免運費優惠</b>。</span>
                        </div>
                      ) : (
                        <div>
                          <span>
                            再選購 <span className="text-art-gold font-mono font-bold">NT$ {1000 - subtotal}</span> 即可享<b>免運費</b> (超商或宅配)。
                          </span>
                          <div className="w-full h-1 bg-art-border rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-art-gold" style={{ width: `${(subtotal / 1000) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart Items list */}
                    <div className="space-y-4">
                      {cart.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-art-border text-xs font-sans relative group"
                        >
                          <img
                            src={item.bean.image}
                            alt={item.bean.name}
                            className="w-16 h-16 object-cover rounded-xl shrink-0 bg-art-card-alt"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow min-w-0">
                            <h4 className="font-serif font-bold text-art-text-heading line-clamp-1 mb-1">
                              {item.bean.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-art-text-subtle font-mono mb-2">
                              <span>{item.weight}</span>
                              <span>•</span>
                              <span className="line-clamp-1">{item.grind}</span>
                            </div>

                            {/* Quantity toggler and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-art-border bg-art-card-alt rounded-lg overflow-hidden shrink-0">
                                <button
                                  onClick={() => onUpdateQuantity(idx, -1)}
                                  className="px-2 py-1 text-art-text-muted hover:text-art-text-heading hover:bg-art-border transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 font-mono font-semibold text-art-text-heading text-xs">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(idx, 1)}
                                  className="px-2 py-1 text-art-text-muted hover:text-art-text-heading hover:bg-art-border transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="font-mono text-art-text font-bold text-sm">
                                NT$ {item.price * item.quantity}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="absolute top-4 right-4 text-art-text-subtle hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleCheckoutSubmit} className="pt-6 border-t border-art-border space-y-4">
                      <div className="flex items-center space-x-2 text-art-text-heading text-xs font-serif font-bold border-b border-art-border pb-2">
                        <FileText className="w-4 h-4 text-art-gold" />
                        <span>填寫收件與結帳資料</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-art-text-subtle block mb-1">收件人姓名 *</label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                            placeholder="如：老楊先生"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-art-text-subtle block mb-1">聯絡電話 *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                            placeholder="如：0912-345678"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-art-text-subtle block mb-1">電子信箱 (選填)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                          placeholder="your-email@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-art-text-subtle block mb-1 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-art-gold" />
                            <span>運送方式</span>
                          </label>
                          <select
                            value={shippingMethod}
                            onChange={(e) => setShippingMethod(e.target.value as any)}
                            className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                          >
                            <option value="超商取貨 (7-11/全家)">超商取貨 (7-11/全家)</option>
                            <option value="黑貓低溫宅配">黑貓低溫宅配</option>
                            <option value="郵寄到府">郵寄到府</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-art-text-subtle block mb-1 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-art-gold" />
                            <span>付款管道</span>
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                          >
                            <option value="超商取貨付款">超商取貨付款</option>
                            <option value="信用卡線上刷卡">信用卡線上刷卡</option>
                            <option value="ATM 轉帳">ATM 轉帳</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-art-text-subtle block mb-1">
                          {shippingMethod.includes("超商") ? "超商門市資訊 / 完整收件地址 *" : "收件地址 *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="w-full p-2.5 rounded-none border border-art-border bg-white text-art-text text-xs focus:outline-none focus:border-art-gold"
                          placeholder={shippingMethod.includes("超商") ? "請填寫 超商門市名稱 (如 7-11 老楊門市)" : "請輸入完整的收件地址"}
                        />
                      </div>

                      {formError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-[11px] text-red-700 rounded-none text-center">
                          {formError}
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>

              {/* Sticky Footer summary and Action */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-art-border bg-white space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-art-text-muted">
                      <span>商品小計</span>
                      <span className="font-mono text-art-text font-medium">NT$ {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-art-text-muted">
                      <span>運費</span>
                      <span className="font-mono text-art-text font-medium">
                        {shippingFee === 0 ? "免運費" : `NT$ ${shippingFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-art-border">
                      <span className="font-serif font-bold text-art-text-heading">總金額 Total</span>
                      <span className="font-mono text-xl text-art-gold font-extrabold">NT$ {total}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutSubmit}
                    className="w-full py-4 rounded-none bg-art-text-heading hover:bg-art-gold text-white font-medium text-sm tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                    id="submit-order-btn"
                  >
                    <span>成立職人訂單</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
