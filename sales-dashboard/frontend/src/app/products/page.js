'use client'
import { useState, useEffect } from 'react';
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import ProductModal from '@/components/ProductModal';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao buscar produtos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error('Falha ao buscar produtos.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (formData, productId) => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const method = productId ? 'PUT' : 'POST';
    const endpoint = productId ? `${apiUrl}/api/products/${productId}` : `${apiUrl}/api/products`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar produto');
      }

      toast.success(`Produto ${productId ? 'atualizado' : 'criado'} com sucesso!`);
      fetchProducts(); // Re-fetch para atualizar a lista
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Falha ao salvar produto.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Falha ao excluir produto');
        }
        toast.success('Produto excluído com sucesso!');
        fetchProducts();
    } catch (error) {
        console.error(error);
        toast.error('Falha ao excluir produto.');
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
            <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlusCircle size={20} />
              <span>Adicionar Produto</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou SKU..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10"><p>Carregando produtos...</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Produto</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Categoria</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">Preço</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">Estoque</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600">{product.category}</td>
                        <td className="py-3 px-4 text-gray-800 text-right">{formatCurrency(product.price)}</td>
                        <td className="py-3 px-4 text-gray-800 text-right">{product.stock}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center items-center space-x-2">
                              <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:text-blue-700 p-1">
                                  <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 p-1">
                                  <Trash2 size={18} />
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && <ProductModal product={selectedProduct} onClose={handleCloseModal} onSave={handleSaveProduct} />}
    </>
  );
}
