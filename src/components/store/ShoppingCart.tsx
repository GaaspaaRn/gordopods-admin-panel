
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart as CartIcon, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ShoppingCart = () => {
  const { cart, isCartOpen, toggleCart, closeCart, updateQuantity, removeItem } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <CartIcon className="mr-2" size={20} />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>
        
        {cart.items.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center py-12">
            <CartIcon size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Seu carrinho está vazio</h3>
            <p className="text-sm text-gray-500 mt-1">
              Adicione produtos para continuar com o pedido
            </p>
            <Button className="mt-6" onClick={closeCart}>
              Voltar às Compras
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-6 h-[60vh]">
              <div className="space-y-4 pr-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 py-3 border-b last:border-b-0"
                  >
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = "https://via.placeholder.com/100?text=Item";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    
                    {/* Product details */}
                    <div className="flex flex-col flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      
                      {/* Variations */}
                      {item.selectedVariations.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.selectedVariations.map((variation) => (
                            <div
                              key={`${variation.groupId}-${variation.optionId}`}
                              className="flex text-sm text-gray-600"
                            >
                              <span>{variation.groupName}: </span>
                              <span className="ml-1 font-medium">{variation.optionName}</span>
                              {variation.priceModifier !== 0 && (
                                <span className="text-xs ml-1">
                                  ({variation.priceModifier > 0 ? "+" : ""}
                                  {variation.priceModifier.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="font-medium">
                          {(item.totalPrice / item.quantity).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {cart.subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              
              <SheetFooter className="flex flex-col gap-3 sm:flex-row mt-6">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Continuar Comprando
                  </Button>
                </SheetClose>
                
                <Button className="w-full sm:w-auto">
                  Finalizar Pedido
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
