
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUploader';
import { Loader2, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentUrl?: string;
  onImageChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  className?: string;
  recommendedSize?: string;
}

export function ImageUpload({
  currentUrl,
  onImageChange,
  folder = 'misc',
  label = 'Imagem',
  className,
  recommendedSize
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Criar preview local primeiro
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setIsUploading(true);
      const imageUrl = await uploadImage(file, 'gordopods-assets', folder);
      
      if (imageUrl) {
        onImageChange(imageUrl);
        toast.success('Imagem enviada com sucesso!');
      } else {
        throw new Error('Não foi possível obter a URL da imagem.');
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
      
      // Limpar preview em caso de erro
      if (previewUrl && previewUrl !== currentUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(currentUrl || null);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    // Limpar preview local se houver
    if (previewUrl && previewUrl !== currentUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    onImageChange(null);
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Erro";
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
        {recommendedSize && (
          <p className="text-xs text-muted-foreground">
            {recommendedSize}
          </p>
        )}
      </div>
    </div>
  );
}
