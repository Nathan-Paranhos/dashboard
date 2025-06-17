import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { UserNav } from '@/components/dashboard/user-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Notifications } from '@/components/notifications';
import { Search } from '@/components/search';

type HeaderProps = {
  title?: string;
  description?: string;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  actions?: React.ReactNode;
  showUserNav?: boolean;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showBreadcrumbs?: boolean;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  logoHref?: string;
  logo?: React.ReactNode;
  showLogo?: boolean;
  rightContent?: React.ReactNode;
};

export function Header({
  title,
  description,
  className,
  showSearch = false,
  searchPlaceholder = 'Pesquisar...',
  onSearch,
  searchValue = '',
  onSearchValueChange,
  actions,
  showUserNav = true,
  showThemeToggle = true,
  showNotifications = true,
  breadcrumbs = [],
  showBreadcrumbs = true,
  onMenuClick,
  showMenuButton = true,
  logoHref = '/dashboard',
  logo,
  showLogo = false,
  rightContent,
}: HeaderProps) {
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Icons.menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          )}

          {showLogo && (
            <Link
              href={logoHref}
              className="hidden items-center space-x-2 md:flex"
            >
              {logo || (
                <>
                  <Icons.logo className="h-6 w-6" />
                  <span className="hidden font-bold sm:inline-block">
                    {process.env.NEXT_PUBLIC_APP_NAME || 'Dashboard'}
                  </span>
                </>
              )}
            </Link>
          )}

          {showBreadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden items-center md:flex">
              <nav className="flex items-center space-x-1 text-sm">
                {breadcrumbs.map((item, index) => (
                  <div key={item.href || index} className="flex items-center">
                    {index > 0 && (
                      <Icons.chevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                          pathname === item.href && 'text-foreground'
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {showSearch && (
            <div className="w-full flex-1 md:max-w-sm lg:max-w-md">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="w-full pl-9"
                    value={searchValue}
                    onChange={(e) =>
                      onSearchValueChange?.(e.target.value)
                    }
                  />
                </div>
              </form>
            </div>
          )}

          {rightContent}

          {showThemeToggle && <ModeToggle />}

          {showNotifications && <Notifications />}

          {showUserNav && <UserNav />}

          {actions}
        </div>
      </div>
    </header>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string | null;
  className?: string;
  actions?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-center justify-between', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}
