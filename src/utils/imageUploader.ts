
import { supabase } from '@/integrations/supabase/client';
import { ensureStorageBucket } from '@/integrations/supabase/client';

// Logger simples para depuração
const logger = {
  info: (message: string, ...args: any[]) => console.info(`[INFO] ${message}`, ...args),
  success: (message: string, ...args: any[]) => console.log(`[SUCCESS] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
};

/**
 * Realiza upload de imagem para o Supabase Storage com retries automáticos
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

    // Garantir que o bucket exista
    await ensureStorageBucket();

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    // Fazer upload para o Supabase Storage com retry automático
    let attempts = 0;
    let error = null;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        logger.info(`Tentativa ${attempts + 1} de upload da imagem ${file.name}`);
        
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: attempts > 0
          });

        if (uploadError) {
          // Erro específico para buckets inexistentes
          if (uploadError.message?.includes('bucket') && uploadError.message?.includes('not found')) {
            logger.warn('Bucket não encontrado, tentando criar...');
            // Tentar criar bucket
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
              public: true
            });
            
            if (createError) {
              logger.error('Erro ao criar bucket:', createError);
            } else {
              logger.success('Bucket criado com sucesso');
              // Continuar com próxima tentativa
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 500)); 
              continue;
            }
          }
          
          error = uploadError;
          logger.warn(`Falha na tentativa ${attempts + 1}:`, uploadError);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s antes de tentar novamente
        } else {
          // Sucesso - Obter URL pública
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
            
          logger.success('Upload da imagem concluído com sucesso', urlData.publicUrl);
          return urlData.publicUrl;
        }
      } catch (e) {
        error = e;
        logger.error(`Erro na tentativa ${attempts + 1}:`, e);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    logger.error('Erro no upload após múltiplas tentativas:', error);
    throw error || new Error('Falha ao fazer upload após múltiplas tentativas');
  } catch (error) {
    logger.error('Erro no upload de imagem:', error);
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
    
    logger.info(`Removendo imagem: ${filePath} do bucket ${bucketName}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      logger.error('Erro ao remover imagem:', error);
    }
      
    return !error;
  } catch (error) {
    logger.error('Erro ao remover imagem:', error);
    return false;
  }
}
