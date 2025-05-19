
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Usar valores das variáveis de ambiente Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qlhlctnewasecayjnitr.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGxjdG5ld2FzZWNheWpuaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3ODEsImV4cCI6MjA2MjkzMDc4MX0.Dr7WTegg96VpxMKLD3rC5cbhexAGGs3ITyR1T1pxcxA";

// Verificar se as variáveis de ambiente estão definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Variáveis de ambiente Supabase não definidas!');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Função para garantir que o bucket exista
export async function ensureStorageBucket() {
  try {
    // Verificar se o bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
      return false;
    }
    
    // Se o bucket não existe, tentar criá-lo
    if (!buckets.find(bucket => bucket.name === 'gordopods-assets')) {
      console.log('Bucket não encontrado, tentando criar...');
      
      const { data, error } = await supabase.storage.createBucket('gordopods-assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      });
      
      if (error) {
        console.error('Erro ao criar bucket de armazenamento:', error);
        return false;
      }
      
      console.log('Bucket criado com sucesso:', data);
    } else {
      console.log('Bucket gordopods-assets já existe');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    return false;
  }
}

// Função de utilidade para verificar conexão
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count()', { count: 'exact' });
    if (error) throw error;
    console.log('Conexão com Supabase estabelecida com sucesso');
    
    // Garantir que o bucket exista após verificar a conexão
    await ensureStorageBucket();
    
    return true;
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return false;
  }
}

// Chamar a verificação de conexão ao carregar o cliente
checkSupabaseConnection().then(connected => {
  if (connected) {
    console.log('Supabase inicializado com sucesso');
  } else {
    console.error('Falha ao inicializar Supabase');
  }
});
