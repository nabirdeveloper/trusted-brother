"use client";
import { useEffect, useState } from 'react';

interface Variant {
  size?: string;
  color?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  categories: string[];
  variants: Variant[];
  description?: string;
  images: string[];
}

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto mb-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Images</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">SKU</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Categories</th>
              <th className="border px-2 py-1">Variants</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td className="border px-2 py-1">
                  <div className="flex gap-1 flex-wrap">
                    {product.images && product.images.map((img, idx) => (
                      <img key={idx} src={img} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    ))}
                  </div>
                </td>
                <td className="border px-2 py-1 font-medium">{product.name}</td>
                <td className="border px-2 py-1">{product.sku}</td>
                <td className="border px-2 py-1">{product.stock}</td>
                <td className="border px-2 py-1">
                  {product.categories && product.categories.length > 0 ? product.categories.join(', ') : '-'}
                </td>
                <td className="border px-2 py-1">
                  {product.variants && product.variants.length > 0 ? (
                    <ul>
                      {product.variants.map((v, idx) => (
                        <li key={idx}>
                          {v.size && <span>Size: {v.size} </span>}
                          {v.color && <span>Color: {v.color}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : '-'}
                </td>
                <td className="border px-2 py-1">${product.price.toFixed(2)}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 