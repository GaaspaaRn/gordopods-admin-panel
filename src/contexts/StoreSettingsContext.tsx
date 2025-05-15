
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { StoreSettings, DeliverySettings, StoreConfig } from '../types';
import { toast } from 'sonner';

interface StoreSettingsContextType {
  storeSettings: StoreSettings;
  deliverySettings: DeliverySettings;
  storeConfig: StoreConfig;
  isLoading: boolean;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateDeliverySettings: (settings: Partial<DeliverySettings>) => void;
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
  addSocialLink: (name: string, url: string) => void;
  updateSocialLink: (id: string, name: string, url: string) => void;
  removeSocialLink: (id: string) => void;
  addNeighborhood: (name: string, fee: number) => void;
  updateNeighborhood: (id: string, name: string, fee: number) => void;
  removeNeighborhood: (id: string) => void;
}

const initialStoreSettings: StoreSettings = {
  storeName: 'Gordopods',
  logo: '',
  banner: '',
  primaryColor: '#9b87f5',
  secondaryColor: '#6E59A5',
  description: 'Os melhores pods da região!',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/gordopods' },
  ],
  contactInfo: {
    phone: '',
    email: '',
  },
};

const initialDeliverySettings: DeliverySettings = {
  pickup: {
    enabled: true,
    instructions: 'Retire em nossa loja central entre 10h e 20h.',
  },
  fixedRate: {
    enabled: true,
    fee: 5.00,
    description: 'Taxa fixa para toda a cidade',
  },
  neighborhoodRates: {
    enabled: false,
    neighborhoods: [
      { id: '1', name: 'Centro', fee: 5.00 },
      { id: '2', name: 'Zona Sul', fee: 8.00 },
    ],
  },
};

const initialStoreConfig: StoreConfig = {
  whatsappNumber: '5547999999999',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(initialStoreSettings);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(initialDeliverySettings);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(initialStoreConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedStoreSettings = localStorage.getItem('storeSettings');
        if (storedStoreSettings) {
          setStoreSettings(JSON.parse(storedStoreSettings));
        }

        const storedDeliverySettings = localStorage.getItem('deliverySettings');
        if (storedDeliverySettings) {
          setDeliverySettings(JSON.parse(storedDeliverySettings));
        }

        const storedStoreConfig = localStorage.getItem('storeConfig');
        if (storedStoreConfig) {
          setStoreConfig(JSON.parse(storedStoreConfig));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
      localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));
      localStorage.setItem('storeConfig', JSON.stringify(storeConfig));
    }
  }, [storeSettings, deliverySettings, storeConfig, isLoading]);

  const updateStoreSettings = (settings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...settings }));
    toast.success('Configurações da loja atualizadas!');
  };

  const updateDeliverySettings = (settings: Partial<DeliverySettings>) => {
    setDeliverySettings(prev => ({ ...prev, ...settings }));
    toast.success('Configurações de entrega atualizadas!');
  };

  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({ ...prev, ...config }));
    toast.success('Configurações gerais atualizadas!');
  };

  // Social links management
  const addSocialLink = (name: string, url: string) => {
    const newLink = { id: crypto.randomUUID(), name, url };
    setStoreSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }));
    toast.success('Link social adicionado!');
  };

  const updateSocialLink = (id: string, name: string, url: string) => {
    setStoreSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, name, url } : link
      ),
    }));
    toast.success('Link social atualizado!');
  };

  const removeSocialLink = (id: string) => {
    setStoreSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id),
    }));
    toast.success('Link social removido!');
  };

  // Neighborhood management
  const addNeighborhood = (name: string, fee: number) => {
    const newNeighborhood = { id: crypto.randomUUID(), name, fee };
    setDeliverySettings(prev => ({
      ...prev,
      neighborhoodRates: {
        ...prev.neighborhoodRates,
        neighborhoods: [...prev.neighborhoodRates.neighborhoods, newNeighborhood],
      },
    }));
    toast.success('Bairro adicionado!');
  };

  const updateNeighborhood = (id: string, name: string, fee: number) => {
    setDeliverySettings(prev => ({
      ...prev,
      neighborhoodRates: {
        ...prev.neighborhoodRates,
        neighborhoods: prev.neighborhoodRates.neighborhoods.map(neighborhood =>
          neighborhood.id === id ? { ...neighborhood, name, fee } : neighborhood
        ),
      },
    }));
    toast.success('Bairro atualizado!');
  };

  const removeNeighborhood = (id: string) => {
    setDeliverySettings(prev => ({
      ...prev,
      neighborhoodRates: {
        ...prev.neighborhoodRates,
        neighborhoods: prev.neighborhoodRates.neighborhoods.filter(
          neighborhood => neighborhood.id !== id
        ),
      },
    }));
    toast.success('Bairro removido!');
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        storeSettings,
        deliverySettings,
        storeConfig,
        isLoading,
        updateStoreSettings,
        updateDeliverySettings,
        updateStoreConfig,
        addSocialLink,
        updateSocialLink,
        removeSocialLink,
        addNeighborhood,
        updateNeighborhood,
        removeNeighborhood,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
