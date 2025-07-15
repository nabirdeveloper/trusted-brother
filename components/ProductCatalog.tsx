"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  images?: string[];
}

interface ApiResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 12;

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      });
      const res = await fetch(`/api/products?${params.toString()}`);
      const data: ApiResponse = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setLoading(false);
    };
    fetchProducts();
  }, [page]);

  // Helper to generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      range.push(i);
    }
    return range;
  };

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Showing {startIdx}-{endIdx} of {total} products
      </div>
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="border rounded p-4 shadow hover:shadow-lg transition">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover mb-2 rounded"
                  style={{ objectFit: 'cover', width: '100%', height: '160px' }}
                  priority={true}
                />
              <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
              <p className="text-gray-600 mb-1">Category: {product.category}</p>
              <p className="text-blue-600 font-bold mb-2">${product.price.toFixed(2)}</p>
              {product.description && <p className="text-sm text-gray-500">{product.description}</p>}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          First
        </button>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        {getPageNumbers().map(num => (
          <button
            key={num}
            className={`px-3 py-1 border rounded ${num === page ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'} transition`}
            onClick={() => setPage(num)}
            disabled={num === page}
          >
            {num}
          </button>
        ))}
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default ProductCatalog; 