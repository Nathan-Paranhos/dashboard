import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { NavItem } from '@/types';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  className?: string;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
  isMobile?: boolean;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  showLogo?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
  logoHref?: string;
}

export function SidebarNav({
  className,
  items,
  isCollapsed = false,
  onCollapse,
  onExpand,
  isMobile = false,
  logo,
  footer,
  header,
  showLogo = true,
  showFooter = true,
  showHeader = true,
  logoHref = '/dashboard',
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Toggle sidebar collapsed state
  const toggleCollapse = () => {
    if (isCollapsed && onExpand) {
      onExpand();
    } else if (!isCollapsed && onCollapse) {
      onCollapse();
    }
  };

  // Render navigation items
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item, index) => {
      const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : null;
      const isActive = pathname === item.href || (item.matchPath && pathname.startsWith(item.matchPath));
      const hasItems = item.items && item.items.length > 0;

      if (hasItems) {
        return (
          <div key={item.href || index} className="space-y-1">
            {!isCollapsed && item.title && (
              <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </h4>
            )}
            {renderNavItems(item.items!)}
          </div>
        );
      }

      if (item.href) {
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              isActive && 'font-medium',
              isCollapsed && 'h-10 w-10 p-0',
              item.className
            )}
            onClick={item.onClick}
          >
            <Link href={item.href}>
              {Icon && <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />}
              {!isCollapsed && item.title}
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          </Button>
        );
      }

      if (item.separator) {
        return <div key={`separator-${index}`} className="h-px bg-border my-2" />;
      }

      return null;
    });
  };

  // Mobile menu trigger button
  const mobileTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => setOpen(true)}
    >
      <Icons.menu className="h-5 w-5" />
      <span className="sr-only">Abrir menu</span>
    </Button>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div
      className={cn(
        'hidden h-screen flex-col border-r bg-background md:flex',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center px-4">
        {showLogo && (
          <Link href={logoHref} className="flex items-center space-x-2">
            {logo || (
              <>
                <Icons.logo className="h-6 w-6" />
                {!isCollapsed && (
                  <span className="text-lg font-bold">{siteConfig.name}</span>
                )}
              </>
            )}
          </Link>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
          {showHeader && header}
          {renderNavItems(items)}
        </nav>
      </ScrollArea>

      {showFooter && (
        <div className="border-t p-4">
          {footer || (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <Icons.chevronRight className="h-4 w-4" />
              ) : (
                <>
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Recolher
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Mobile sidebar (sheet)
  const mobileSidebar = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{mobileTrigger}</SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link href={logoHref} className="flex items-center space-x-2">
              {logo || (
                <>
                  <Icons.logo className="h-6 w-6" />
                  <span className="text-lg font-bold">{siteConfig.name}</span>
                </>
              )}
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <nav className="space-y-1 p-4">
              {showHeader && header}
              {renderNavItems(items)}
            </nav>
          </ScrollArea>
          {showFooter && footer && (
            <div className="border-t p-4">{footer}</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {isMobile ? mobileTrigger : null}
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}

type SidebarNavItem = NavItem;

export { SidebarNavItem };
