'use client'

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    // Para a página de login, renderiza apenas o conteúdo, sem a sidebar.
    return <>{children}</>;
  }

  // Para todas as outras páginas, renderiza o layout principal com a sidebar.
  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
