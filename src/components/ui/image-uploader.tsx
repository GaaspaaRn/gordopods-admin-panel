
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImagePreview } from './image-preview';
import { ImageUploadForm } from './image-upload-form';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  imageClassName?: string;
  recommendedSize?: string;
}

export function ImageUploader({
  onImageUploaded,
  currentImageUrl,
  folder = 'misc',
  label = 'Imagem',
  imageClassName = 'max-h-40 object-contain',
  recommendedSize
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [urlInput, setUrlInput] = useState('');
  // Sempre começa com o modo 'file', independente de haver uma URL atual
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica de tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('O arquivo selecionado não é uma imagem válida');
      return;
    }

    // Validação de tamanho (máximo de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem não pode ter mais de 5MB');
      return;
    }

    try {
      // Mostrar preview local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Iniciar upload
      setIsUploading(true);
      
      // Gerar nome de arquivo único baseado em timestamp e nome original
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('gordopods-assets')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('gordopods-assets')
        .getPublicUrl(filePath);

      // Callback com a URL da imagem
      onImageUploaded(urlData.publicUrl);
      
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem. Tente novamente.');
      
      // Limpar preview em caso de erro
      if (previewUrl && !currentImageUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) return;
    
    setPreviewUrl(urlInput);
    onImageUploaded(urlInput);
    toast.success('URL da imagem definida com sucesso!');
  }, [urlInput, onImageUploaded]);

  const handleRemoveImage = useCallback(() => {
    // Limpar preview local se houver
    if (previewUrl && !currentImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    onImageUploaded(''); // Limpar a imagem
  }, [previewUrl, currentImageUrl, onImageUploaded]);

  const toggleUploadMode = useCallback(() => {
    setUploadMode(prev => prev === 'file' ? 'url' : 'file');
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleUploadMode}
          className="text-xs"
        >
          {uploadMode === 'file'
            ? 'Usar URL externa'
            : 'Fazer upload de arquivo'}
        </Button>
      </div>

      <ImageUploadForm 
        isUploading={isUploading}
        uploadMode={uploadMode}
        recommendedSize={recommendedSize}
        onFileChange={handleFileChange}
        onUrlSubmit={handleUrlSubmit}
        urlInput={urlInput}
        onUrlChange={setUrlInput}
      />

      <ImagePreview 
        previewUrl={previewUrl}
        isUploading={isUploading}
        onRemove={handleRemoveImage}
        imageClassName={imageClassName}
        uploadMode={uploadMode}
      />
    </div>
  );
}
