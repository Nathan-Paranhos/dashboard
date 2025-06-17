import './globals.css'
import { Inter } from 'next/font/google'
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard de Vendas',
  description: 'Sistema de gerenciamento de vendas empresarial',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
