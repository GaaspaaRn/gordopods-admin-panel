export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
  stockQuantity: number;
  autoStockReduction: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  banner: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  socialLinks: SocialLink[];
  contactInfo: {
    phone: string;
    email: string;
  };
  whatsappNumber?: string; // Adicionado campo para número de WhatsApp
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
    neighborhoods: {
      id: string;
      name: string;
      fee: number;
    }[];
  };
}

export interface StoreConfig {
  whatsappNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
