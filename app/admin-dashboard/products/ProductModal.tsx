"use client";
import { useState, useEffect } from 'react';

export interface Product {
  _id?: string;
  name: string;
  images: string[];
  categories: string[];
  status: 'in_stock' | 'out_of_stock' | 'coming_soon';
  stock: number;
  price: number;
  sku: string;
  variants: Array<{ size?: string; color?: string }>;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  initialProduct?: Product;
  onSuccess: () => void;
}

export default function ProductModal({ open, onClose, initialProduct, onSuccess }: ProductModalProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [stock, setStock] = useState(initialProduct?.stock?.toString() || '');
  const [price, setPrice] = useState(initialProduct?.price?.toString() || '');
  const [categories, setCategories] = useState<string[]>(initialProduct?.categories || []);
  const [status, setStatus] = useState<Product['status']>(initialProduct?.status || 'in_stock');
  const [variants, setVariants] = useState<Product['variants']>(initialProduct?.variants || []);
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [variantSize, setVariantSize] = useState('');
  const [variantColor, setVariantColor] = useState('');

  useEffect(() => {
    if (open) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => setAllCategories(data.categories || []));
    }
  }, [open]);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setSku(initialProduct.sku || '');
      setStock(initialProduct.stock?.toString() || '');
      setPrice(initialProduct.price?.toString() || '');
      setCategories(initialProduct.categories || []);
      setStatus(initialProduct.status || 'in_stock');
      setVariants(initialProduct.variants || []);
      setDescription(initialProduct.description || '');
      setImages(initialProduct.images || []);
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Validation
    if (!name.trim() || !sku.trim() || !price || !stock || categories.length === 0 || images.length === 0) {
      setError('Name, price, sku, stock, categories, and at least one image are required.');
      setLoading(false);
      return;
    }
    const method = initialProduct?._id ? 'PUT' : 'POST';
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: initialProduct?._id,
        name,
        sku,
        stock: Number(stock),
        price: Number(price),
        categories,
        status,
        variants,
        description,
        images,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || 'Failed to save product');
    } else {
      setSuccess(initialProduct?._id ? 'Product updated!' : 'Product created!');
      onSuccess();
      onClose();
    }
  };

  // Cloudinary upload handler
  const handleImageUpload = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    setImages([...images, ...urls]);
    setImageFiles([]);
  };

  const handleAddVariant = () => {
    if (variantSize || variantColor) {
      setVariants([...variants, { size: variantSize, color: variantColor }]);
      setVariantSize('');
      setVariantColor('');
    }
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">{initialProduct ? 'Edit' : 'Add'} Product</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">SKU</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Stock</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Price</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="block mb-1">Categories</label>
            <select multiple value={categories} onChange={e => setCategories(Array.from(e.target.selectedOptions, o => o.value))} className="w-full border rounded px-3 py-2">
              {allCategories.map(cat => (
                <option key={cat.name + Math.random()} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Product['status'])} className="w-full border rounded px-3 py-2">
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1">Images <span className="text-xs text-gray-500">(multiple allowed)</span></label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setImageFiles(Array.from(e.target.files || []))}
              className="w-full"
            />
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              disabled={imageFiles.length === 0}
              onClick={() => handleImageUpload(imageFiles)}
            >
              Upload Selected Images
            </button>
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden relative">
                  <img src={img} alt="preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white bg-opacity-80 text-red-500 rounded-full px-1 text-xs"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1">Variants <span className="text-xs text-gray-500">(size, color)</span></label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Size" value={variantSize} onChange={e => setVariantSize(e.target.value)} className="border rounded px-2 py-1 w-1/2" />
              <input type="text" placeholder="Color" value={variantColor} onChange={e => setVariantColor(e.target.value)} className="border rounded px-2 py-1 w-1/2" />
              <button type="button" onClick={handleAddVariant} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
            </div>
            <ul className="mb-2">
              {variants.map((v, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  {v.size && <span>Size: {v.size}</span>}
                  {v.color && <span>Color: {v.color}</span>}
                  <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-500 text-xs ml-2">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Saving...' : (initialProduct ? 'Update' : 'Add')}</button>
        </form>
      </div>
    </div>
  );
}