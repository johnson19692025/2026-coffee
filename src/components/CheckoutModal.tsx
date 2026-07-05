import { motion } from "motion/react";
import { Order } from "../types";
import { X, CheckCircle2, Copy, Printer, FileText, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

interface CheckoutModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function CheckoutModal({ order, onClose }: CheckoutModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyReceipt = () => {
    const textToCopy = `【理查印尼精品咖啡 - 訂單確認單】
訂單編號：${order.id}
訂購日期：${order.orderDate}
顧客姓名：${order.customerName}
聯絡電話：${order.phone}
運送管道：${order.shippingMethod}
收件門市/地址：${order.shippingAddress}
付款管道：${order.paymentMethod}

【訂購商品細項】
${order.items.map((item) => `- ${item.bean.name} (${item.weight} / ${item.grind}) x ${item.quantity} = NT$ ${item.price * item.quantity}`).join("\n")}

商品小計：NT$ ${order.subtotal}
運費：NT$ ${order.shippingFee}
最終總計：NT$ ${order.total}

感謝您的訂購！理查烘豆師正為您精心準備，預計將於 24 小時內完成新鮮烘焙並寄出。`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white border border-art-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative text-art-text"
      >
        {/* Confetti element decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-art-gold" />

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Header Success block */}
          <div className="text-center pb-6 border-b border-art-border mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-art-gold/10 text-art-gold border border-art-gold/30 mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-art-text-heading flex items-center justify-center gap-1.5">
              <span>訂單成立，感謝您的品味支持！</span>
            </h3>
            <p className="text-art-text-muted text-xs font-sans mt-1.5 max-w-sm mx-auto leading-relaxed">
              老楊烘豆師已收到您的預訂。我們堅持「接單後新鮮烘焙」，為您保留印尼單品火山豆最飽滿的香氣特徵。
            </p>
          </div>

          {/* Printable Vintage Style Invoice Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-art-card-alt border border-art-border text-xs font-sans space-y-5 relative">
            {/* Decors */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-art-text-subtle uppercase tracking-widest flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-art-gold" />
              <span>Boutique Receipt</span>
            </div>

            {/* Order No and date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-art-border pb-3">
              <div>
                <span className="text-art-text-subtle block mb-0.5">訂單編號 Order No.</span>
                <span className="font-mono text-art-gold font-bold tracking-wider">{order.id}</span>
              </div>
              <div>
                <span className="text-art-text-subtle block mb-0.5">訂購時間 Date</span>
                <span className="font-mono text-art-text font-medium">{order.orderDate}</span>
              </div>
            </div>

            {/* Customer specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-art-text-subtle block mb-1 font-semibold">顧客資訊</span>
                <ul className="space-y-1 text-art-text-muted">
                  <li>姓名: {order.customerName}</li>
                  <li>電話: {order.phone}</li>
                  <li>信箱: {order.email}</li>
                </ul>
              </div>
              <div>
                <span className="text-art-text-subtle block mb-1 font-semibold">物流與結帳</span>
                <ul className="space-y-1 text-art-text-muted">
                  <li>運送: {order.shippingMethod}</li>
                  <li>收件: <span className="text-art-gold font-medium">{order.shippingAddress}</span></li>
                  <li>支付: {order.paymentMethod}</li>
                </ul>
              </div>
            </div>

            {/* Purchase Item List loop */}
            <div className="border-t border-art-border pt-4">
              <span className="text-art-text-subtle block mb-2.5 font-semibold">訂購商品細項 Details</span>
              <div className="space-y-2.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className="text-art-text-heading font-serif font-bold block">{item.bean.name}</span>
                      <span className="text-[10px] text-art-text-subtle block font-mono">
                        {item.weight} / {item.grind} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono text-art-text font-bold shrink-0">
                      NT$ {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary breakdown */}
            <div className="border-t border-art-border pt-4 space-y-1.5">
              <div className="flex justify-between text-art-text-subtle text-[11px]">
                <span>商品小計 Subtotal</span>
                <span className="font-mono text-art-text">NT$ {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-art-text-subtle text-[11px]">
                <span>運費 Shipping Fee</span>
                <span className="font-mono text-art-text">
                  {order.shippingFee === 0 ? "免運費" : `NT$ ${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-art-border text-[11px]">
                <span className="font-serif font-bold text-art-text-heading">實付金額 Total Due</span>
                <span className="font-mono text-base text-art-gold font-extrabold">NT$ {order.total}</span>
              </div>
            </div>

            {/* Fake bar-code decoration representing elegant commerce */}
            <div className="pt-4 flex flex-col items-center justify-center opacity-40">
              <div className="h-6 w-48 bg-art-border flex space-x-0.5 overflow-hidden">
                {[...Array(24)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-art-text-heading"
                    style={{ width: `${Math.random() * 6 + 1}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-art-text-subtle tracking-widest uppercase mt-1">
                * THANK YOU FOR PATRONIZING OLD YANG *
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-between items-center relative z-10">
            <button
              onClick={handleCopyReceipt}
              className={`px-5 py-3 rounded-none border border-art-border bg-white text-art-text-muted hover:text-art-text-heading hover:bg-art-card-alt text-xs font-semibold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
                copied ? "border-art-gold text-art-gold bg-art-card-alt" : ""
              }`}
              id="copy-receipt-btn"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "已複製明細" : "複製訂單明細"}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-none bg-art-text-heading hover:bg-art-gold text-white text-xs font-bold tracking-widest transition-all cursor-pointer shadow-sm"
                id="close-success-btn"
              >
                <span>回到首頁</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
