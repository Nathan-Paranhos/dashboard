'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../lib/api';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUp, 
  TrendingUp,
  Package,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Search,
  Calendar,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { cn } from '../../lib/utils';

// Tipagem para os dados do dashboard
interface DashboardData {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    growthRate: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  salesData: { _id: string; totalSales: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  topSellers: { name: string; totalSales: number }[];
  categoryData: { _id: string; totalRevenue: number }[];
}

// Cores para os gráficos
const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
];

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  
  // Estados do componente
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [dateFilter, setDateFilter] = useState('month');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Função para buscar os dados do dashboard
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Simulando dados de resposta da API
      const response = await api.get('/dashboard', {
        params: { period: dateFilter }
      });
      
      setData(response.data);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setErrorMessage('Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efeito para buscar dados quando o filtro de data mudar
  useEffect(() => {
    fetchData();
  }, [dateFilter]);
  
  // Atualizar dados a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateFilter]);

  // Função para lidar com a busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Aqui você pode implementar a lógica de busca
    console.log('Buscando por:', term);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para formatar números
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Função para formatar porcentagem
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Renderizar o componente de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Renderizar o componente de erro
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Erro ao carregar o dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Renderizar o componente quando não houver dados
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  // Dados simulados para os gráficos
  const salesData = data.salesData || [];
  const topProducts = data.topProducts || [];
  const topSellers = data.topSellers || [];
  const categoryData = data.categoryData || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        className="lg:translate-x-0"
      />
      
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <Header 
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          isMenuOpen={isMenuOpen}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          userName={user?.name || 'Usuário'}
          onLogout={handleLogout}
          onSearch={handleSearch}
          searchPlaceholder="Buscar vendas, produtos..."
        />
        
        {/* Main Content */}
        <main className="flex-1 pb-8">
          {/* Page header */}
          <div className="bg-white dark:bg-gray-800 shadow">
            <div className="px-4 sm:px-6 lg:max-w-7xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:leading-9 sm:truncate">
                    Visão Geral
                  </h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4
                ">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Exportar
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Nova Venda
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'analytics', 'reports', 'notifications'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Sales */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Vendas Totais
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(data.summary.totalSales)}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                              <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                              <span className="sr-only">Aumentou em</span>
                              {data.summary.growthRate}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ShoppingCart className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Pedidos
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                              {formatNumber(data.summary.totalOrders)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Clientes
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                              {formatNumber(data.summary.totalCustomers)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Taxa de Conversão
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                              {formatPercentage(data.summary.conversionRate)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vendas</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        <option value="day">Hoje</option>
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mês</option>
                        <option value="year">Este Ano</option>
                      </select>
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                        />
                        <YAxis 
                          tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                          tickFormatter={(value) => `R$ ${value}`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Vendas']}
                          labelFormatter={(label) => `Período: ${label}`}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                            borderRadius: '0.375rem',
                            color: theme === 'dark' ? '#F3F4F6' : '#111827',
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalSales" 
                          name="Vendas" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Categories Chart */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categorias</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="totalRevenue"
                          nameKey="_id"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Receita']}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                            borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                            borderRadius: '0.375rem',
                            color: theme === 'dark' ? '#F3F4F6' : '#111827',
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Top Products */}
            <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Atividades Recentes</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Novo pedido #100{5 - item}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Cliente {['João', 'Maria', 'Pedro', 'Ana', 'Carlos'][item - 1]} realizou um pedido
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {item}h atrás
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 text-right">
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver todas as atividades<span aria-hidden="true"> &rarr;</span>
                    </a>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Produtos Mais Vendidos</h3>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  {product.quantity} vendas
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatCurrency(product.revenue)}
                              </p>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.round((product.quantity / data.summary.totalOrders) * 100)}% do total
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 mt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Sales Dashboard. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
