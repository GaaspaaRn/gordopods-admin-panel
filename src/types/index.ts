
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
