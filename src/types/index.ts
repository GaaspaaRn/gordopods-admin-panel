
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  logo?: string;
  banner?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  socialLinks: SocialLink[];
  contactInfo: {
    phone?: string;
    email?: string;
  };
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
}

export interface DeliverySettings {
  pickup: {
    enabled: boolean;
    instructions: string;
  };
  fixedRate: {
    enabled: boolean;
    fee: number;
    description: string;
  };
  neighborhoodRates: {
    enabled: boolean;
    neighborhoods: Neighborhood[];
  };
}

export interface Neighborhood {
  id: string;
  name: string;
  fee: number;
}

export interface StoreConfig {
  whatsappNumber: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
}

export interface ProductVariationOption {
  id: string;
  name: string;
  priceModifier: number;
  stock?: number;
}

export interface ProductVariationGroup {
  id: string;
  name: string;
  options: ProductVariationOption[];
  required: boolean;
  multipleSelection: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: ProductImage[];
  variationGroups: ProductVariationGroup[];
  stockControl: boolean;
  stockQuantity?: number;
  autoStockReduction: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// New types for cart functionality
export interface SelectedVariation {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  basePrice: number;
  selectedVariations: SelectedVariation[];
  totalPrice: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}
