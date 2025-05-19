
import { useState, useEffect } from 'react';

// Breakpoints conforme o padrão do Tailwind CSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook para detectar se a largura da tela está acima de um breakpoint específico
 */
export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsAboveBreakpoint(width >= breakpoints[breakpoint]);
    };

    // Verificar tamanho inicial
    checkScreenSize();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);

    // Limpar listener ao desmontar o componente
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

/**
 * Hook para detectar se o dispositivo é mobile (abaixo do breakpoint md)
 */
export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}

/**
 * Hook para obter o breakpoint atual
 */
export function useCurrentBreakpoint(): BreakpointKey | null {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey | null>(null);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      // Verificar de maior para menor para garantir que pegue o breakpoint correto
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        // Abaixo do menor breakpoint
        setCurrentBreakpoint(null);
      }
    };

    // Verificar breakpoint inicial
    checkBreakpoint();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkBreakpoint);

    // Limpar listener
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return currentBreakpoint;
}
