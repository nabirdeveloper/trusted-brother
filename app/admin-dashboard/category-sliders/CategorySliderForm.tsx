"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface CategorySliderFormProps {
  initial?: {
    id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    order: number;
    categoryId: string;
  };
  onSuccess?: () => void;
}

export default function CategorySliderForm({ initial, onSuccess }: CategorySliderFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl || '');
  const [order, setOrder] = useState(initial?.order || 0);
  const [categoryId, setCategoryId] = useState(initial?.categoryId || '');
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          // Store the image data URL temporarily
          setImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB limit
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          setImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/category-sliders', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initial?.id,
          title,
          description,
          imageUrl,
          linkUrl,
          order,
          categoryId,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Failed to save category slider');
      } else {
        setTitle('');
        setDescription('');
        setImageUrl('');
        setLinkUrl('');
        setOrder(0);
        setCategoryId('');
        onSuccess?.();
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred while saving the category slider');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option key="default" value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            {previewImage ? (
              <div className="relative h-48 w-full">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-500 mb-2">
                  Drag & drop an image here, or click to select
                </div>
                <div className="text-sm text-gray-400">
                  Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Link URL</label>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
          disabled={loading}
        >
          {loading ? 'Saving...' : (initial?.id ? 'Update Category Slider' : 'Add Category Slider')}
        </button>
      </div>
    </form>
  );
}
