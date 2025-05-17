
import React, { createContext, useState, useContext, useEffect } from 'react';
import { StoreSettings, SocialLink } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreSettingsContextType {
  storeSettings: StoreSettings;
  isLoading: boolean;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  addSocialLink: (socialLink: Omit<SocialLink, 'id'>) => Promise<void>;
  updateSocialLink: (id: string, socialLink: Partial<Omit<SocialLink, 'id'>>) => Promise<void>;
  removeSocialLink: (id: string) => Promise<void>;
}

const defaultSettings: StoreSettings = {
  storeName: 'Gordopods',
  logo: '',
  banner: '',
  primaryColor: '#6E56CF',
  secondaryColor: '#FF8B3E',
  description: '',
  socialLinks: [],
  contactInfo: {
    phone: '',
    email: '',
  },
  whatsappNumber: '',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar configurações da loja no Supabase ao iniciar
  useEffect(() => {
    async function loadStoreSettings() {
      setIsLoading(true);
      try {
        // Tentar carregar do Supabase primeiro
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Erro ao carregar configurações da loja:', error);
          // Se falhar, tentar carregar do localStorage como fallback
          const storedSettings = localStorage.getItem('storeSettings');
          if (storedSettings) {
            setStoreSettings(JSON.parse(storedSettings));
          }
        } else if (data) {
          // Converter os dados do Supabase para o formato esperado
          const socialLinks: SocialLink[] = [];
          if (data.facebook_url) {
            socialLinks.push({ id: 'facebook', name: 'Facebook', url: data.facebook_url });
          }
          if (data.instagram_url) {
            socialLinks.push({ id: 'instagram', name: 'Instagram', url: data.instagram_url });
          }

          const settings: StoreSettings = {
            storeName: data.store_name,
            logo: data.logo_url || '',
            banner: data.banner_url || '',
            primaryColor: '#6E56CF', // Usar valor padrão
            secondaryColor: '#FF8B3E', // Usar valor padrão
            description: data.store_description || '',
            socialLinks: socialLinks,
            contactInfo: {
              phone: '',
              email: '',
            },
            whatsappNumber: data.whatsapp_number || '',
          };

          setStoreSettings(settings);
          // Guardar também no localStorage para fallback
          localStorage.setItem('storeSettings', JSON.stringify(settings));
        }
      } catch (error) {
        console.error('Erro inesperado ao carregar configurações da loja:', error);
        // Tentar carregar do localStorage como último recurso
        const storedSettings = localStorage.getItem('storeSettings');
        if (storedSettings) {
          setStoreSettings(JSON.parse(storedSettings));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadStoreSettings();
  }, []);

  // Salvar configurações da loja no Supabase sempre que houver mudanças
  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    try {
      const updatedSettings = { ...storeSettings, ...settings };
      setStoreSettings(updatedSettings);

      // Salvar no localStorage como backup
      localStorage.setItem('storeSettings', JSON.stringify(updatedSettings));

      // Preparar dados para o formato do Supabase
      const supabaseData = {
        store_name: updatedSettings.storeName,
        logo_url: updatedSettings.logo,
        banner_url: updatedSettings.banner,
        store_description: updatedSettings.description,
        whatsapp_number: updatedSettings.whatsappNumber,
        facebook_url: updatedSettings.socialLinks.find(l => l.name === 'Facebook')?.url || null,
        instagram_url: updatedSettings.socialLinks.find(l => l.name === 'Instagram')?.url || null,
      };

      // Verificar se já existe um registro
      const { data: existingData, error: queryError } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1);

      if (queryError) {
        console.error('Erro ao verificar configurações existentes:', queryError);
        throw queryError;
      }

      let saveError;
      if (existingData && existingData.length > 0) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('store_settings')
          .update(supabaseData)
          .eq('id', existingData[0].id);
        
        saveError = error;
      } else {
        // Inserir novo registro
        const { error } = await supabase
          .from('store_settings')
          .insert([supabaseData]);
        
        saveError = error;
      }

      if (saveError) {
        console.error('Erro ao salvar configurações da loja no Supabase:', saveError);
        toast.error('Erro ao salvar configurações da loja. Tente novamente.');
      } else {
        toast.success('Configurações da loja salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro inesperado ao atualizar configurações:', error);
      toast.error('Erro ao salvar configurações da loja. Tente novamente.');
    }
  };

  const addSocialLink = async (socialLink: Omit<SocialLink, 'id'>) => {
    try {
      const newLink = {
        ...socialLink,
        id: crypto.randomUUID(),
      };
      
      const updatedLinks = [...storeSettings.socialLinks, newLink];
      await updateStoreSettings({ socialLinks: updatedLinks });
      toast.success('Link social adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar link social:', error);
      toast.error('Erro ao adicionar link social. Tente novamente.');
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<Omit<SocialLink, 'id'>>) => {
    try {
      const updatedLinks = storeSettings.socialLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      );
      
      await updateStoreSettings({ socialLinks: updatedLinks });
      toast.success('Link social atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar link social:', error);
      toast.error('Erro ao atualizar link social. Tente novamente.');
    }
  };

  const removeSocialLink = async (id: string) => {
    try {
      const updatedLinks = storeSettings.socialLinks.filter((link) => link.id !== id);
      await updateStoreSettings({ socialLinks: updatedLinks });
      toast.success('Link social removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover link social:', error);
      toast.error('Erro ao remover link social. Tente novamente.');
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        storeSettings,
        isLoading,
        updateStoreSettings,
        addSocialLink,
        updateSocialLink,
        removeSocialLink,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error('useStoreSettings deve ser usado dentro de um StoreSettingsProvider');
  }
  return context;
};
