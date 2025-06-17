import { ReactNode } from 'react';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Loading } from '../ui/loading';
import { ToastContainer } from '../ui/toast';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  requireAuth?: boolean;
}

export function MainLayout({
  children,
  title = 'Dashboard',
  description = 'Painel administrativo',
  requireAuth = true,
}: MainLayoutProps) {
  const { theme, resolvedTheme } = useTheme();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { ToastContainer: ToastNotifications } = useToast();

  // Se a página requer autenticação e o usuário não está autenticado
  if (requireAuth && !isAuthenticated && !isLoading) {
    // Redireciona para a página de login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Mostra um loading enquanto verifica a autenticação
  if (requireAuth && (isLoading || !isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Head>
        <title>{`${title} | Sales Dashboard`}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onLogout={logout} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastNotifications />
    </div>
  );
}
