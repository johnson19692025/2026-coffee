export interface CoffeeBean {
  id: string;
  name: string;
  englishName: string;
  region: string;
  processing: string; // 濕剝法, 水洗, 日曬, 蜜處理
  roastLevel: string; // 淺中焙, 中焙, 中深焙
  roastLevelText: string;
  elevation: string;
  grade: string; // G1, Double Picked, etc.
  flavorNotes: string[];
  description: string;
  story: string;
  priceHalfPound: number; // 227g (半磅) 價格
  priceOnePound: number;  // 454g (一磅) 價格
  aroma: number; // 1-5 scale
  acidity: number; // 1-5 scale
  body: number; // 1-5 scale
  sweetness: number; // 1-5 scale
  balance: number; // 1-5 scale
  image: string; // Asset URL
  inventory: number;
}

export interface RoastBatch {
  id: string;
  batchNumber: string;
  beanId: string;
  beanName: string;
  roastDate: string;
  moistureLoss: string; // e.g., 14.2%
  developmentTime: string; // e.g., 1m 45s
  roasterName: string;
  qualityRating: "優異" | "卓越" | "特優";
  notes: string;
}

export interface TerroirRegion {
  id: string;
  name: string;
  island: string;
  elevation: string;
  soil: string;
  processingTradition: string;
  flavorProfileSummary: string;
  description: string;
  aroma: number;
  acidity: number;
  body: number;
  sweetness: number;
  spiciness: number;
}

export interface CartItem {
  bean: CoffeeBean;
  weight: "227g" | "454g";
  grind: "整豆 (不代磨)" | "手沖研磨" | "義式研磨" | "摩卡壺研磨" | "法壓壺研磨";
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  email: string;
  shippingMethod: "超商取貨 (7-11/全家)" | "黑貓低溫宅配" | "郵寄到府";
  shippingAddress: string;
  paymentMethod: "信用卡線上刷卡" | "ATM 轉帳" | "超商取貨付款";
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "processing" | "shipped" | "delivered";
  orderDate: string;
}
