import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useWindowSize } from '@/hooks/use-window-size';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  items?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Vendas',
    href: '/sales',
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: 'Produtos',
    href: '/products',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Clientes',
    href: '/customers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Pedidos',
    href: '/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fecha o menu em dispositivos móveis ao mudar de rota
  useEffect(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [pathname, isMobile, isTablet]);

  // Gerar as iniciais do usuário para o avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Verifica se um item está ativo
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Alterna o tema
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Renderiza um item de navegação
  const renderNavItem = (item: NavItem) => {
    const isItemActive = isActive(item.href);

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={cn(
            'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
            isItemActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!isCollapsed && <span className="ml-3">{item.title}</span>}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Botão para abrir o menu em dispositivos móveis */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Alternar menu</span>
      </Button>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out',
          isCollapsed && 'w-20',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isScrolled && 'shadow-lg'
        )}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="flex h-16 items-center border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 font-bold"
          >
            <span className="text-xl">🚀</span>
            {!isCollapsed && <span>SalesDash</span>}
          </Link>
        </div>

        {/* Conteúdo rolável */}
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => renderNavItem(item))}
            </ul>
          </nav>
        </ScrollArea>

        {/* Rodapé da Sidebar */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            {/* Perfil do usuário */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getUserInitials(user.name) : 'US'}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            {/* Botão para alternar tema */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleTheme}
              title="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </div>

          {/* Botão de logout */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!isCollapsed && 'Sair'}
          </Button>
        </div>
      </aside>
    </>
  );
}
