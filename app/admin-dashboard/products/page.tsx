"use client";
import { useEffect, useState } from 'react';
import { Product } from './ProductModal';
import ProductModal from './ProductModal';

const statusBadge = (status: Product['status']) => {
  if (status === 'in_stock') return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">In Stock</span>;
  if (status === 'out_of_stock') return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Out of Stock</span>;
  return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Coming Soon</span>;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(11);


  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setModalOpen(false);
  }, []);

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct({
      ...product,
      images: product.images ?? [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
    setLoading(false);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(products.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <button
            className="border px-3 py-2 rounded bg-white hover:bg-gray-100"
            onClick={handleAdd}
            type="button"
          >
            Add Product
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="w-full p-2 border rounded"
            >
              <option value={11}>11</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <div className="text-sm text-gray-500">Showing {paginatedProducts.length} of {products.length} (Total: {products.length})</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.status}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => product._id && handleDelete(product._id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
          >
            &gt;
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(Math.ceil(products.length / itemsPerPage))}
            disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
} 