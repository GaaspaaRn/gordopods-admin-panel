
import { supabase } from '@/integrations/supabase/client';

/**
 * Realiza upload de imagem para o Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucketName: string = 'gordopods-assets',
  folderPath: string = 'misc'
): Promise<string | null> {
  try {
    // Validações básicas
    if (!file) return null;
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo inválido: Apenas imagens são permitidas.');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande: Máximo 5MB permitido.');
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    // Fazer upload para o Supabase Storage com retry automático
    let attempts = 0;
    let error = null;
    
    while (attempts < 3) {
      try {
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: attempts > 0
          });

        if (uploadError) {
          error = uploadError;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s antes de tentar novamente
        } else {
          // Sucesso - Obter URL pública
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
            
          return urlData.publicUrl;
        }
      } catch (e) {
        error = e;
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    console.error('Erro no upload após múltiplas tentativas:', error);
    throw error || new Error('Falha ao fazer upload após múltiplas tentativas');
  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    throw error;
  }
}

/**
 * Remove uma imagem do Supabase Storage
 */
export async function removeImage(
  imageUrl: string,
  bucketName: string = 'gordopods-assets'
): Promise<boolean> {
  try {
    if (!imageUrl) return true;
    
    // Extrair o path da URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucketName) + 1).join('/');
    
    if (!filePath) return false;
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    return !error;
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return false;
  }
}
