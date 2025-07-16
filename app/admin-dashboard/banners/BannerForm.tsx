"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface BannerFormProps {
  initial?: {
    id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    order: number;
  };
  onSuccess?: () => void;
}

export default function BannerForm({ initial, onSuccess }: BannerFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl || '');
  const [order, setOrder] = useState(initial?.order || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(initial?.imageUrl || null);
  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB limit
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initial?.id,
          title,
          description,
          imageUrl,
          linkUrl,
          order,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to save banner');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center w-full">
              <FaUpload className="text-4xl text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              Drag & drop an image here or click to select
            </p>
            <input
              {...getInputProps()}
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Select Image
            </label>
          </div>
        </div>

        {previewImage && (
          <div className="mt-4">
            <Image
              src={previewImage}
              alt="Preview"
              width={400}
              height={200}
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Link URL</label>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
