"use client";
import { useState } from 'react';

interface CategoryFormProps {
  initial?: { id?: string; name: string; description?: string };
  onSuccess?: () => void;
}

export default function CategoryForm({ initial, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: initial?.id, name, description }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Failed to save category');
      } else {
        setName('');
        setDescription('');
        onSuccess?.();
      }
    } catch {
      setError('An error occurred while saving the category');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" 
        />
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (initial?.id ? 'Update Category' : 'Add Category')}
        </button>
      </div>
    </form>
  );
}