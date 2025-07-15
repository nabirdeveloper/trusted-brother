"use client";
import { useState } from 'react';

interface Variant {
  size?: string;
  color?: string;
}

interface ProductFormProps {
  onProductCreated?: () => void;
}

export default function AdminProductForm({ onProductCreated }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [categories, setCategories] = useState(''); // comma-separated
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantSize, setVariantSize] = useState('');
  const [variantColor, setVariantColor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUpload = async (): Promise<string[]> => {
    setUploading(true);
    const urls: string[] = [];
    for (const img of images) {
      const formData = new FormData();
      formData.append('file', img);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) urls.push(data.secure_url);
    }
    setUploading(false);
    return urls;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!name || !price || !sku || !stock || !categories) {
      setError('Name, price, sku, stock, and categories are required');
      return;
    }
    
    // Convert numeric fields
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (isNaN(numericPrice) || isNaN(numericStock)) {
      setError('Price and stock must be valid numbers');
      return;
    }

    let imageUrls: string[] = [];
    if (images.length > 0) {
      try {
        imageUrls = await handleImageUpload();
        if (imageUrls.length === 0) {
          setError('Failed to upload images');
          return;
        }
      } catch (error) {
        setError('Error uploading images');
        return;
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: numericPrice,
          sku,
          stock: numericStock,
          categories: categories.split(',').map(c => c.trim()).filter(Boolean),
          variants,
          description,
          images: imageUrls,
          status: 'in_stock' // Set default status
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || 'Failed to create product');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSuccess('Product created successfully!');
        setName('');
        setPrice('');
        setSku('');
        setStock('');
        setCategories('');
        setVariants([]);
        setDescription('');
        setImages([]);
        onProductCreated?.();
      } else {
        setError(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Product creation error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-3">
        <label className="block mb-1">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Price</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">SKU</label>
        <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Stock</label>
        <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Categories <span className="text-xs text-gray-500">(comma separated)</span></label>
        <input type="text" value={categories} onChange={e => setCategories(e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="mb-3">
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
      <div className="mb-3">
        <label className="block mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Images <span className="text-xs text-gray-500">(multiple allowed)</span></label>
        <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files || []))} className="w-full" />
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((img, idx) => (
            <div key={idx} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img src={URL.createObjectURL(img)} alt="preview" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" disabled={uploading}>{uploading ? 'Uploading...' : 'Create Product'}</button>
    </form>
  );
} 