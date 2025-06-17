'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
              <nav className="flex items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 mr-6">Início</Link>
                <Link href="/dashboard/products" className="text-gray-600 hover:text-blue-500 mr-6">Produtos</Link>
                {user && <span className="mr-4 text-gray-700">Olá, {user.name}</span>}
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
