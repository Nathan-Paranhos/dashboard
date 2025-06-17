import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Só executa no cliente
    if (typeof window === 'undefined') {
      return;
    }

    // Função para atualizar o estado com o tamanho atual da janela
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Adiciona o event listener
    window.addEventListener('resize', handleResize);

    // Chama a função uma vez para definir o tamanho inicial
    handleResize();

    // Remove o event listener na limpeza
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determina o tipo de dispositivo com base na largura da tela
  const isMobile = windowSize.width ? windowSize.width < 640 : false;
  const isTablet = windowSize.width ? windowSize.width >= 640 && windowSize.width < 1024 : false;
  const isDesktop = windowSize.width ? windowSize.width >= 1024 : false;

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}
