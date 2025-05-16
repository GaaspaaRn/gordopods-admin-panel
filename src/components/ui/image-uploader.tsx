
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  imageClassName?: string;
}

export function ImageUploader({
  onImageUploaded,
  currentImageUrl,
  folder = 'misc',
  label = 'Imagem',
  imageClassName = 'max-h-40 object-contain'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(currentImageUrl ? 'url' : 'file');

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

      {uploadMode === 'file' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="url"
            placeholder="https://exemplo.com/imagem.png"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlSubmit}
          >
            <Upload className="h-4 w-4 mr-2" /> Definir
          </Button>
        </div>
      )}

      {/* Área de preview */}
      {isUploading ? (
        <div className="flex justify-center items-center h-40 border rounded bg-muted/20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Enviando imagem...</p>
          </div>
        </div>
      ) : previewUrl ? (
        <div className="relative border rounded overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full ${imageClassName}`}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/300x200?text=Erro+na+imagem";
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-40 border rounded border-dashed bg-muted/20">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {uploadMode === 'file' 
                ? 'Selecione uma imagem para upload'
                : 'Insira a URL da imagem'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
