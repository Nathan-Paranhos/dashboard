'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Renderiza um placeholder enquanto a verificação acontece para evitar flash de conteúdo
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return null; // Ou um componente de loading em tela cheia
  }

  return <>{children}</>;
}
