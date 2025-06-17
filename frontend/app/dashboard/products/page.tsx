'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProductModal from '@/components/ProductModal'; 
import { Toaster, toast } from 'react-hot-toast'; 

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Falha ao carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleOpenModal = (product: Product | null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setProductToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData: Omit<Product, '_id'>) => {
    try {
      if (productToEdit) {
        const response = await api.put(`/products/${productToEdit._id}`, productData);
        setProducts(products.map(p => p._id === productToEdit._id ? response.data : p));
        toast.success('Produto atualizado com sucesso!');
      } else {
        const response = await api.post('/products', productData);
        setProducts([...products, response.data]);
        toast.success('Produto criado com sucesso!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Falha ao salvar o produto.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Produto excluído com sucesso!');
      } catch (error) {
        toast.error('Falha ao excluir o produto.');
      }
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando produtos...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
        {user?.role === 'admin' && (
          <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Adicionar Produto
          </button>
        )}
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Categoria</th>
              <th className="py-3 px-6 text-center">Preço</th>
              <th className="py-3 px-6 text-center">Estoque</th>
              {user?.role === 'admin' && <th className="py-3 px-6 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-150">
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.category}</td>
                <td className="py-3 px-6 text-center">R$ {product.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-center">{product.stock}</td>
                {user?.role === 'admin' && (
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleOpenModal(product)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md mr-2 transition duration-300">Editar</button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md transition duration-300">Excluir</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveProduct} 
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ProductsPage;
