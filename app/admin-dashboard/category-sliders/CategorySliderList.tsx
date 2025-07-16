"use client";

import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export interface CategorySlider {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  category: {
    _id: string;
    name: string;
  };
}

interface CategorySliderListProps {
  onEditAction: (slider: CategorySlider) => void;
  onAddNewAction: () => void;
}

export default function CategorySliderList({ onEditAction, onAddNewAction }: CategorySliderListProps) {
  const [sliders, setSliders] = useState<CategorySlider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSliders();
  }, [currentPage]);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/category-sliders');
      const data = await res.json();
      setSliders(data.sliders);
    } catch (err) {
      setError('Failed to fetch category sliders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sliderId: string) => {
    if (!confirm('Are you sure you want to delete this category slider?')) return;

    try {
      const res = await fetch('/api/category-sliders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sliderId }),
      });

      if (!res.ok) throw new Error('Failed to delete category slider');

      setSliders(sliders.filter((slider) => slider._id !== sliderId));
    } catch (err) {
      setError('Failed to delete category slider');
    }
  };

  const handleToggleActive = async (sliderId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/category-sliders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sliderId, isActive: !isActive }),
      });

      if (!res.ok) throw new Error('Failed to update category slider status');

      setSliders((prev) =>
        prev.map((slider) =>
          slider._id === sliderId ? { ...slider, isActive: !isActive } : slider
        )
      );
    } catch (err) {
      setError('Failed to update category slider status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search category sliders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <button
            onClick={fetchSliders}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Search
          </button>
        </div>
        <button
          onClick={onAddNewAction}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaPlus className="inline-block mr-2" />
          Add New Category Slider
        </button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sliders.map((slider) => (
                <tr key={slider._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{slider.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{slider.title}</div>
                    {slider.description && (
                      <div className="text-sm text-gray-500">{slider.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={slider.imageUrl}
                      alt={slider.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {slider.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(slider._id, slider.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slider.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {slider.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditAction(slider)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
