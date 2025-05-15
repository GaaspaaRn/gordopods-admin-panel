
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { Trash2, Plus } from 'lucide-react';
import { Neighborhood } from '@/types';

export default function Settings() {
  const { 
    storeConfig, 
    deliverySettings, 
    updateStoreConfig, 
    updateDeliverySettings,
    addNeighborhood,
    updateNeighborhood,
    removeNeighborhood
  } = useStoreSettings();
  
  // WhatsApp settings
  const [whatsappNumber, setWhatsappNumber] = useState(storeConfig.whatsappNumber);
  
  // Delivery settings
  const [pickupEnabled, setPickupEnabled] = useState(deliverySettings.pickup.enabled);
  const [pickupInstructions, setPickupInstructions] = useState(deliverySettings.pickup.instructions);
  
  const [fixedRateEnabled, setFixedRateEnabled] = useState(deliverySettings.fixedRate.enabled);
  const [fixedRateFee, setFixedRateFee] = useState(deliverySettings.fixedRate.fee.toString());
  const [fixedRateDescription, setFixedRateDescription] = useState(deliverySettings.fixedRate.description);
  
  const [neighborhoodRatesEnabled, setNeighborhoodRatesEnabled] = useState(deliverySettings.neighborhoodRates.enabled);
  
  // New neighborhood state
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');
  const [newNeighborhoodFee, setNewNeighborhoodFee] = useState('');
  
  // Neighborhood editing state
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [editNeighborhoodName, setEditNeighborhoodName] = useState('');
  const [editNeighborhoodFee, setEditNeighborhoodFee] = useState('');
  
  const handleSaveWhatsApp = () => {
    updateStoreConfig({ whatsappNumber });
  };
  
  const handleSavePickup = () => {
    updateDeliverySettings({
      pickup: {
        enabled: pickupEnabled,
        instructions: pickupInstructions,
      }
    });
  };
  
  const handleSaveFixedRate = () => {
    updateDeliverySettings({
      fixedRate: {
        enabled: fixedRateEnabled,
        fee: parseFloat(fixedRateFee) || 0,
        description: fixedRateDescription,
      }
    });
  };
  
  const handleSaveNeighborhoodSettings = () => {
    updateDeliverySettings({
      neighborhoodRates: {
        ...deliverySettings.neighborhoodRates,
        enabled: neighborhoodRatesEnabled,
      }
    });
  };
  
  const handleAddNeighborhood = () => {
    if (newNeighborhoodName && newNeighborhoodFee) {
      const fee = parseFloat(newNeighborhoodFee) || 0;
      addNeighborhood(newNeighborhoodName, fee);
      setNewNeighborhoodName('');
      setNewNeighborhoodFee('');
    }
  };
  
  const startEditNeighborhood = (neighborhood: Neighborhood) => {
    setEditingNeighborhood(neighborhood);
    setEditNeighborhoodName(neighborhood.name);
    setEditNeighborhoodFee(neighborhood.fee.toString());
  };
  
  const handleSaveEditNeighborhood = () => {
    if (editingNeighborhood && editNeighborhoodName && editNeighborhoodFee) {
      const fee = parseFloat(editNeighborhoodFee) || 0;
      updateNeighborhood(editingNeighborhood.id, editNeighborhoodName, fee);
      setEditingNeighborhood(null);
    }
  };
  
  const handleCancelEditNeighborhood = () => {
    setEditingNeighborhood(null);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Configurações da Loja</h1>
          <p className="text-muted-foreground">
            Configure preferências gerais e opções de entrega da sua loja
          </p>
        </div>
        
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="pickup">Retirada</TabsTrigger>
            <TabsTrigger value="fixedRate">Taxa Fixa</TabsTrigger>
            <TabsTrigger value="neighborhoods">Bairros</TabsTrigger>
          </TabsList>
          
          {/* WhatsApp Settings */}
          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de WhatsApp</CardTitle>
                <CardDescription>
                  Configure o número de WhatsApp que receberá os pedidos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">Número de WhatsApp (formato internacional)</Label>
                  <Input
                    id="whatsappNumber"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="5547999999999"
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira seu número no formato internacional sem espaços ou caracteres especiais. 
                    Ex: 5547999999999 (55 = Brasil, 47 = DDD, seguido do número)
                  </p>
                </div>
                
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Como funciona:</h3>
                  <p className="text-sm">
                    Quando um cliente finaliza o pedido na loja, ele será direcionado para o WhatsApp 
                    com uma mensagem automática contendo todos os detalhes do pedido. 
                    Você pode então confirmar o pedido e fornecer instruções adicionais ao cliente.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveWhatsApp}>
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pickup Settings */}
          <TabsContent value="pickup">
            <Card>
              <CardHeader>
                <CardTitle>Retirada no Local</CardTitle>
                <CardDescription>
                  Configure as opções para clientes retirarem os produtos no local
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pickup-enabled"
                    checked={pickupEnabled}
                    onCheckedChange={setPickupEnabled}
                  />
                  <Label htmlFor="pickup-enabled">Habilitar retirada no local</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup-instructions">Instruções para Retirada</Label>
                  <Textarea
                    id="pickup-instructions"
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                    placeholder="Exemplo: Retire em nossa loja entre 10h e 20h"
                    disabled={!pickupEnabled}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePickup}>
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Fixed Rate Settings */}
          <TabsContent value="fixedRate">
            <Card>
              <CardHeader>
                <CardTitle>Entrega com Taxa Fixa</CardTitle>
                <CardDescription>
                  Configure a entrega com valor fixo para toda a região
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fixed-rate-enabled"
                    checked={fixedRateEnabled}
                    onCheckedChange={setFixedRateEnabled}
                  />
                  <Label htmlFor="fixed-rate-enabled">Habilitar entrega com taxa fixa</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fixed-rate-fee">Valor da Taxa (R$)</Label>
                  <Input
                    id="fixed-rate-fee"
                    type="number"
                    value={fixedRateFee}
                    onChange={(e) => setFixedRateFee(e.target.value)}
                    placeholder="0.00"
                    disabled={!fixedRateEnabled}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fixed-rate-description">Descrição</Label>
                  <Input
                    id="fixed-rate-description"
                    value={fixedRateDescription}
                    onChange={(e) => setFixedRateDescription(e.target.value)}
                    placeholder="Exemplo: Taxa fixa para toda a cidade"
                    disabled={!fixedRateEnabled}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveFixedRate}>
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Neighborhood Settings */}
          <TabsContent value="neighborhoods">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Entrega por Bairros/Regiões</CardTitle>
                    <CardDescription>
                      Configure taxas de entrega diferentes para cada bairro
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="neighborhood-rates-enabled"
                    checked={neighborhoodRatesEnabled}
                    onCheckedChange={setNeighborhoodRatesEnabled}
                  />
                  <Label htmlFor="neighborhood-rates-enabled">
                    Habilitar entregas com taxas por bairro
                  </Label>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleSaveNeighborhoodSettings}
                  className="mt-2"
                >
                  Salvar Configuração
                </Button>
                
                {neighborhoodRatesEnabled && (
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newNeighborhoodName">Nome do Bairro/Região</Label>
                        <Input
                          id="newNeighborhoodName"
                          value={newNeighborhoodName}
                          onChange={(e) => setNewNeighborhoodName(e.target.value)}
                          placeholder="Centro, Zona Sul, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newNeighborhoodFee">Taxa de Entrega (R$)</Label>
                        <div className="flex gap-2">
                          <Input
                            id="newNeighborhoodFee"
                            type="number"
                            value={newNeighborhoodFee}
                            onChange={(e) => setNewNeighborhoodFee(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleAddNeighborhood}
                            disabled={!newNeighborhoodName || !newNeighborhoodFee}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium mb-4">Bairros cadastrados:</h3>
                      
                      {deliverySettings.neighborhoodRates.neighborhoods.length === 0 ? (
                        <div className="text-center py-6 border rounded-md border-dashed">
                          <p className="text-muted-foreground">
                            Nenhum bairro cadastrado
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {deliverySettings.neighborhoodRates.neighborhoods.map((neighborhood) => (
                            <div 
                              key={neighborhood.id}
                              className="flex items-center justify-between border rounded-md p-3"
                            >
                              {editingNeighborhood?.id === neighborhood.id ? (
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Input
                                    value={editNeighborhoodName}
                                    onChange={(e) => setEditNeighborhoodName(e.target.value)}
                                    className="flex-1"
                                    placeholder="Nome do bairro"
                                  />
                                  <Input
                                    type="number"
                                    value={editNeighborhoodFee}
                                    onChange={(e) => setEditNeighborhoodFee(e.target.value)}
                                    className="flex-1"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                  />
                                  <div className="flex gap-2 md:col-span-2">
                                    <Button 
                                      size="sm"
                                      onClick={handleSaveEditNeighborhood}
                                      className="flex-1"
                                    >
                                      Salvar
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={handleCancelEditNeighborhood}
                                      className="flex-1"
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <div className="font-medium">{neighborhood.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Taxa: R$ {neighborhood.fee.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => startEditNeighborhood(neighborhood)}
                                    >
                                      Editar
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeNeighborhood(neighborhood.id)}
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
