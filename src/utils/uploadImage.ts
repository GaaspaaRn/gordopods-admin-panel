// src/utils/uploadImage.ts
import { supabase } from '../integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(
  file: File,
  bucketName: string = 'gordopods-assets',
  folderPath: string = 'products'
): Promise<string> {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido');
  }

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Por favor, selecione um arquivo de imagem válido');
  }

  // Validar tamanho (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('A imagem deve ter no máximo 2MB');
  }

  // Gerar nome de arquivo único
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`;
  const filePath = `${folderPath}/${fileName}`;

  // Upload para o Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Erro no upload para Supabase:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }

  // Obter URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!publicUrlData.publicUrl) {
    throw new Error('Falha ao obter URL pública');
  }

  return publicUrlData.publicUrl;
}
