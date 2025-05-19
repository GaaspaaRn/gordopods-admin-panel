
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FallbackProps {
  error?: Error | null;
  isLoading?: boolean;
  children?: React.ReactNode;
  retry?: () => void;
  message?: string;
}

export function Fallback({
  error,
  isLoading = false,
  children,
  retry,
  message
}: FallbackProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground text-sm">{message || 'Carregando...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-md p-4 my-4">
        <h3 className="text-red-800 font-medium mb-2">Ocorreu um erro</h3>
        <p className="text-red-600 text-sm mb-4">{error.message}</p>
        {retry && (
          <button
            onClick={retry}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded-md transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
