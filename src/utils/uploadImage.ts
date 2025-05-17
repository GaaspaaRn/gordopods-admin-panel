
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Função para fazer o upload de uma imagem para o Supabase Storage
 * @param file O arquivo da imagem a ser enviado
 * @param bucketName O nome do bucket (padrão: gordopods-assets)
 * @param folder O caminho da pasta no bucket (opcional)
 * @returns URL pública da imagem ou null em caso de erro
 */
export async function uploadImage(
  file: File, 
  bucketName: string = 'gordopods-assets', 
  folder: string = ''
): Promise<string | null> {
  try {
    // Verificar tamanho do arquivo (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande! O tamanho máximo é 2MB.');
      return null;
    }
    
    // Verificar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('O arquivo enviado não é uma imagem válida.');
      return null;
    }
    
    // Criar um nome único para o arquivo usando UUID
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Adicionar o caminho da pasta se especificado
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Fazer o upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Falha ao fazer upload da imagem. Tente novamente.');
      return null;
    }
    
    // Obter a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    // Retornar a URL pública
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error('Erro ao processar upload da imagem:', error);
    toast.error('Ocorreu um erro ao processar a imagem.');
    return null;
  }
}

/**
 * Função para excluir uma imagem do Supabase Storage
 * @param url A URL pública da imagem a ser excluída
 * @param bucketName O nome do bucket (padrão: gordopods-assets)
 * @returns Um booleano indicando se a operação foi bem-sucedida
 */
export async function deleteImage(
  url: string,
  bucketName: string = 'gordopods-assets'
): Promise<boolean> {
  try {
    // Extrair o caminho do arquivo da URL
    const baseStorageUrl = supabase.storageUrl + `/object/public/${bucketName}/`;
    const filePath = url.replace(baseStorageUrl, '');
    
    // Verificar se a URL é do Supabase Storage
    if (url === filePath) {
      console.error('URL fornecida não parece ser do Supabase Storage');
      return false;
    }
    
    // Excluir a imagem
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Erro ao excluir a imagem:', error);
      toast.error('Falha ao excluir a imagem.');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Erro ao processar exclusão da imagem:', error);
    toast.error('Ocorreu um erro ao excluir a imagem.');
    return false;
  }
}
