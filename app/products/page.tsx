import React, { Suspense } from 'react';
import ProductCatalog from '@/components/ProductCatalog';

export default function ProductsPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductCatalog />
      </Suspense>
    </main>
  );
} 