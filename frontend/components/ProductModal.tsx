'use client';

import { useState, useEffect, FormEvent } from 'react';

// Reutilizando a interface Product que já definimos
interface Product {
  _id?: string; // O ID é opcional, pois um novo produto ainda não o terá
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
}

const ProductModal = ({ isOpen, onClose, onSave, productToEdit }: ProductModalProps) => {
  const [product, setProduct] = useState<Product>({ 
    name: '', 
    category: '', 
    price: 0, 
    stock: 0, 
    description: '' 
  });

  // Efeito para preencher o formulário quando um produto é passado para edição
  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      // Limpa o formulário se não houver produto para editar (modo de criação)
      setProduct({ name: '', category: '', price: 0, stock: 0, description: '' });
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{productToEdit ? 'Editar Produto' : 'Adicionar Produto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoria</label>
            <input type="text" name="category" value={product.category} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Preço</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">Estoque</label>
            <input type="number" name="stock" value={product.stock} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
            <textarea name="description" value={product.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" rows={3} required />
          </div>
          <div className="flex items-center justify-end">
            <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
