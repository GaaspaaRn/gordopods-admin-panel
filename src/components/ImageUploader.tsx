
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { Label } from './ui/label';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (url: string | null) => void;
  bucketName?: string;
  folderPath?: string;
  recommendedDimensions?: string;
  label?: string;
  imageType?: 'generic' | 'logo' | 'banner' | 'product';
}

export function ImageUploader({
  currentImageUrl,
  onImageChange,
  bucketName = 'gordopods-assets',
  folderPath = 'products',
  recommendedDimensions,
  label,
  imageType = 'generic'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Definir recomendações de tamanho com base no tipo de imagem
  const getSizeRecommendation = () => {
    if (recommendedDimensions) return recommendedDimensions;
    
    switch (imageType) {
      case 'logo':
        return 'Tamanho recomendado: 200x80px, formato PNG com transparência';
      case 'banner':
        return 'Tamanho recomendado: 1200x400px, formato JPG ou PNG';
      case 'product':
        return 'Tamanho recomendado: 800x800px, formato JPG ou PNG';
      default:
        return 'Tamanho máximo: 2MB';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }

    try {
      setIsUploading(true);

      // Verificar se o bucket existe
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        console.error('Erro ao listar buckets:', bucketsError);
        toast.error('Erro ao verificar storage. Verifique as permissões.');
        return;
      }
      
      // Criar URL de preview local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Gerar nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      // Upload para o Supabase Storage com retry
      let uploadAttempts = 0;
      let uploadSuccess = false;
      let uploadError = null;
      
      while (uploadAttempts < 3 && !uploadSuccess) {
        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: uploadAttempts > 0 // Tentar sobrescrever no retry
            });

          if (error) {
            uploadError = error;
            uploadAttempts++;
            // Aguarda um momento antes de tentar novamente
            if (uploadAttempts < 3) await new Promise(r => setTimeout(r, 1000));
          } else {
            uploadSuccess = true;
            uploadError = null;
            
            // Obter URL pública da imagem
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath);

            // Callback com a URL da imagem
            onImageChange(urlData.publicUrl);
            toast.success('Imagem enviada com sucesso!');
          }
        } catch (e) {
          uploadError = e;
          uploadAttempts++;
          if (uploadAttempts < 3) await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      if (!uploadSuccess) {
        const errorMsg = uploadError?.message || 'Falha ao fazer upload após múltiplas tentativas';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Erro detalhado no upload:', error);
      
      // Mensagens de erro específicas
      if (error.statusCode === 400) {
        toast.error('Formato de arquivo não suportado.');
      } else if (error.statusCode === 403) {
        toast.error('Permissão negada. Verifique as políticas RLS do Storage.');
      } else {
        toast.error('Falha ao enviar imagem. Tente novamente.');
      }
      
      // Manter a URL atual em caso de erro
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      
      {/* Preview da imagem */}
      {previewUrl && (
        <div className="relative w-full max-w-[300px] h-[200px] border rounded-md overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://via.placeholder.com/100?text=Erro";
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            disabled={isUploading}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Área de upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {previewUrl ? 'Trocar imagem' : 'Enviar imagem'}
              </>
            )}
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </div>

        {/* Recomendações de dimensões */}
        <p className="text-xs text-muted-foreground">
          {getSizeRecommendation()}
        </p>
      </div>
    </div>
  );
}
