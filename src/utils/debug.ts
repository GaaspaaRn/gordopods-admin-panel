
import { supabase } from '@/integrations/supabase/client';

/**
 * Verifica a conexão com o Supabase e imprime informações úteis no console
 */
export async function checkEnvironment() {
  try {
    console.log('Verificando ambiente e conexões...');
    
    // Verificar variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Variáveis de ambiente:', {
      supabaseUrl: supabaseUrl ? '✅ Definida' : '❌ Não definida',
      supabaseAnonKey: supabaseAnonKey ? '✅ Definida' : '❌ Não definida',
    });
    
    // Verificar conexão Supabase
    try {
      const { data, error } = await supabase.from('store_settings').select('id').limit(1);
      
      console.log('Conexão Supabase:', error ? '❌ Erro' : '✅ OK');
      
      if (error) {
        console.error('Detalhes do erro Supabase:', error);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão Supabase:', error);
    }
    
    // Verificar bucket do Storage
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('gordopods-assets');
      
      console.log('Bucket gordopods-assets:', bucketError ? '❌ Não encontrado' : '✅ OK');
      
      if (bucketError) {
        console.error('Detalhes do erro de bucket:', bucketError);
      }
    } catch (error) {
      console.error('Erro ao verificar bucket:', error);
    }
    
  } catch (error) {
    console.error('Erro ao verificar ambiente:', error);
  }
}

/**
 * Logger melhorado para desenvolvimento
 */
export const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`❌ ${message}`, error || '');
  },
  
  success: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${message}`, data || '');
    }
  }
};
