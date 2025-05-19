
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

export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsAboveBreakpoint(width >= breakpoints[breakpoint]);
    };

    // Verificar tamanho inicial
    checkScreenSize();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);

    // Limpar listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}
