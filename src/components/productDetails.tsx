
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductDetailsProps {
  handleAddToCart: () => void;
  allRequiredVariationsSelected: () => boolean;
  children?: React.ReactNode;
  isAddingToCart?: boolean;
}

export function ProductDetails({ 
  handleAddToCart, 
  allRequiredVariationsSelected,
  children,
  isAddingToCart = false
}: ProductDetailsProps) {
  return (
    <div className="product-details-container relative">
      {/* Conteúdo do produto */}
      <div className="product-content-area">
        {children}
        
        {/* Espaçador para garantir que o botão não cubra conteúdo em mobile */}
        <div className="h-24 md:h-16"></div>
      </div>
      
      {/* Botão de adicionar ao carrinho - FIXADO NA PARTE INFERIOR EM MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-40 md:static md:p-0 md:border-0 md:shadow-none md:bg-transparent md:mt-4">
        <Button
          onClick={handleAddToCart}
          disabled={!allRequiredVariationsSelected() || isAddingToCart}
          className="w-full py-6 md:py-4"
        >
          {isAddingToCart ? (
            'Adicionando...'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Pedido
            </>
          )}
        </Button>
        
        {!allRequiredVariationsSelected() && (
          <p className="text-red-500 text-sm mt-2 text-center md:text-left">
            Selecione todas as opções obrigatórias
          </p>
        )}
      </div>
    </div>
  );
}
