
import React from 'react';
import { Button } from './ui/button';
import { formatCurrency } from '../utils/format';
import { ArrowRight } from 'lucide-react';

interface FixedCheckoutButtonProps {
  totalPrice: number;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  totalItems?: number;
}

export function FixedCheckoutButton({
  totalPrice,
  onClick,
  disabled = false,
  isLoading = false,
  totalItems = 0
}: FixedCheckoutButtonProps) {
  return (
    <>
      {/* Botão fixo para mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}
            </span>
            <span className="font-bold">{formatCurrency(totalPrice)}</span>
          </div>
          <Button
            onClick={onClick}
            className="flex-1 py-6"
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              'Processando...'
            ) : (
              <>
                Finalizar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Versão para desktop */}
      <div className="hidden md:block">
        <Button
          onClick={onClick}
          className="w-full py-6"
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            'Processando...'
          ) : (
            <>
              Finalizar Pedido
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      {/* Espaçador para mobile */}
      <div className="h-24 md:hidden"></div>
    </>
  );
}
