
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SocialLink } from '@/types';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';

export default function StoreCustomization() {
  const { storeSettings, updateStoreSettings, addSocialLink, updateSocialLink, removeSocialLink } = useStoreSettings();
  
  const [storeName, setStoreName] = useState(storeSettings.storeName);
  const [logo, setLogo] = useState(storeSettings.logo || '');
  const [banner, setBanner] = useState(storeSettings.banner || '');
  const [description, setDescription] = useState(storeSettings.description || '');
  const [primaryColor, setPrimaryColor] = useState(storeSettings.primaryColor || '#9b87f5');
  const [secondaryColor, setSecondaryColor] = useState(storeSettings.secondaryColor || '#6E59A5');
  const [contactPhone, setContactPhone] = useState(storeSettings.contactInfo.phone || '');
  const [contactEmail, setContactEmail] = useState(storeSettings.contactInfo.email || '');
  
  // New social link state
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Social link being edited
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editSocialName, setEditSocialName] = useState('');
  const [editSocialUrl, setEditSocialUrl] = useState('');

  const handleSaveBasic = () => {
    updateStoreSettings({
      storeName,
      logo,
      banner,
      description,
    });
  };

  const handleSaveColors = () => {
    updateStoreSettings({
      primaryColor,
      secondaryColor,
    });
  };

  const handleSaveContact = () => {
    updateStoreSettings({
      contactInfo: {
        phone: contactPhone,
        email: contactEmail,
      },
    });
  };

  const handleAddSocialLink = () => {
    if (newSocialName && newSocialUrl) {
      addSocialLink(newSocialName, newSocialUrl);
      setNewSocialName('');
      setNewSocialUrl('');
    }
  };

  const handleEditLink = (link: SocialLink) => {
    setEditingLinkId(link.id);
    setEditSocialName(link.name);
    setEditSocialUrl(link.url);
  };

  const handleSaveEditLink = () => {
    if (editingLinkId && editSocialName && editSocialUrl) {
      updateSocialLink(editingLinkId, editSocialName, editSocialUrl);
      setEditingLinkId(null);
    }
  };

  const handleCancelEditLink = () => {
    setEditingLinkId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Personalização da Loja</h1>
          <p className="text-muted-foreground">
            Personalize a aparência da sua loja online
          </p>
        </div>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>
          
          {/* Basic Information */}
          <TabsContent value="basic">
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
          </TabsContent>
          
          {/* Appearance */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize as cores da sua loja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Prévia das cores:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className="flex items-center justify-center p-6 rounded-md text-white"
                      style={{backgroundColor: primaryColor}}
                    >
                      Cor Primária
                    </div>
                    <div 
                      className="flex items-center justify-center p-6 rounded-md text-white"
                      style={{backgroundColor: secondaryColor}}
                    >
                      Cor Secundária
                    </div>
                    <div 
                      className="flex items-center justify-center p-6 rounded-md text-black"
                      style={{backgroundColor: '#ffffff', border: `2px solid ${primaryColor}`}}
                    >
                      Borda Primária
                    </div>
                    <div 
                      className="flex items-center justify-center p-6 rounded-md text-black"
                      style={{backgroundColor: '#ffffff', border: `2px solid ${secondaryColor}`}}
                    >
                      Borda Secundária
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveColors}>
                  Salvar Cores
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Social Media */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>
                  Adicione links para suas redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="socialName">Nome da Rede Social</Label>
                    <Input
                      id="socialName"
                      value={newSocialName}
                      onChange={(e) => setNewSocialName(e.target.value)}
                      placeholder="Instagram, Facebook, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialUrl">URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="socialUrl"
                        value={newSocialUrl}
                        onChange={(e) => setNewSocialUrl(e.target.value)}
                        placeholder="https://instagram.com/suaconta"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddSocialLink}
                        disabled={!newSocialName || !newSocialUrl}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Links adicionados:</h3>
                  
                  {storeSettings.socialLinks.length === 0 ? (
                    <div className="text-center py-6 border rounded-md border-dashed">
                      <p className="text-muted-foreground">
                        Nenhuma rede social adicionada
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {storeSettings.socialLinks.map((link) => (
                        <div 
                          key={link.id}
                          className="flex items-center justify-between border rounded-md p-3"
                        >
                          {editingLinkId === link.id ? (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Input
                                value={editSocialName}
                                onChange={(e) => setEditSocialName(e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                value={editSocialUrl}
                                onChange={(e) => setEditSocialUrl(e.target.value)}
                                className="flex-1"
                              />
                              <div className="flex gap-2 md:col-span-2">
                                <Button 
                                  size="sm"
                                  onClick={handleSaveEditLink}
                                  className="flex-1"
                                >
                                  Salvar
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEditLink}
                                  className="flex-1"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="font-medium">{link.name}</div>
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 flex items-center gap-1 hover:underline"
                                >
                                  {link.url} <ExternalLink size={12} />
                                </a>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditLink(link)}
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeSocialLink(link.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Information */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Adicione métodos de contato adicionais para exibir na loja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone para Exibição</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(47) 99999-9999"
                    />
                    <p className="text-xs text-muted-foreground">
                      Este número será exibido para contato, diferente do WhatsApp para pedidos.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email para Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contato@gordopods.com"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveContact}>
                  Salvar Informações de Contato
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
