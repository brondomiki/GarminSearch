export interface Offer {
  id: string;
  retailer: string;
  retailerLogo: string;
  price: number;
  originalPrice: number;
  url: string;
  condition: 'new' | 'refurbished' | 'used';
  shipping: 'free' | 'paid' | 'pickup';
  shippingCost?: number;
  availability: 'available' | 'low_stock' | 'preorder' | 'out_of_stock';
  lastUpdated: string;
  isNew: boolean;
  discount: number;
  rating?: number;
  reviews?: number;
}

export interface PriceHistory {
  date: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}

export interface NotificationSettings {
  enabled: boolean;
  email: string;
  time: string;
  maxPrice: number;
  conditionFilter: ('new' | 'refurbished' | 'used')[];
  notifyNewOffers: boolean;
  notifyPriceDrop: boolean;
  notifyBackInStock: boolean;
}

export interface Retailer {
  name: string;
  logo: string;
  url: string;
  lastChecked: string;
  offersCount: number;
  status: 'active' | 'error' | 'paused';
}
