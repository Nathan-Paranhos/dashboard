'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart2 } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sales', label: 'Vendas', icon: ShoppingCart },
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/users', label: 'Usuários', icon: Users }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center bg-gray-900">
        <h1 className="text-xl font-bold">Sales Pro</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link href={link.href} className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.startsWith(link.href) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
