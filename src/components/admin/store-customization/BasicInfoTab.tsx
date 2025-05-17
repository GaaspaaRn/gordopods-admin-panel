
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageUploader } from '@/components/ui/image-uploader';
import { StoreSettings } from '@/types';

interface BasicInfoTabProps {
  storeSettings: StoreSettings;
  onSave: (settings: Partial<StoreSettings>) => void;
}

export function BasicInfoTab({ storeSettings, onSave }: BasicInfoTabProps) {
  const [storeName, setStoreName] = useState(storeSettings.storeName);
  const [logo, setLogo] = useState(storeSettings.logo || '');
  const [banner, setBanner] = useState(storeSettings.banner || '');
  const [description, setDescription] = useState(storeSettings.description || '');

  // Update local state when storeSettings change (e.g., after saving)
  useEffect(() => {
    setStoreName(storeSettings.storeName);
    setLogo(storeSettings.logo || '');
    setBanner(storeSettings.banner || '');
    setDescription(storeSettings.description || '');
  }, [storeSettings]);

  const handleSaveBasic = () => {
    onSave({
      storeName,
      logo,
      banner,
      description,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>
          Defina as informações principais da sua loja
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeName">Nome da Loja</Label>
          <Input
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <ImageUploader 
            label="Logotipo da Loja"
            currentImageUrl={logo}
            folder="logos"
            onImageUploaded={(url) => setLogo(url)}
            imageClassName="max-h-16 object-contain"
            recommendedSize="Recomendado: 200x200 pixels, Quadrado, Máx 1MB. Formatos: JPG, PNG, WebP."
          />
        </div>
        
        <div className="space-y-2">
          <ImageUploader 
            label="Imagem de Capa/Banner"
            currentImageUrl={banner}
            folder="banners"
            onImageUploaded={(url) => setBanner(url)}
            imageClassName="w-full h-32 object-cover rounded"
            recommendedSize="Recomendado: 1200x400 pixels (proporção 3:1), Máx 2MB. Formatos: JPG, PNG, WebP."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição da Loja</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva sua loja em poucas palavras..."
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveBasic}>
          Salvar Informações
        </Button>
      </CardFooter>
    </Card>
  );
}
