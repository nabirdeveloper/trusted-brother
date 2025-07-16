"use client";

import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface BannerListProps {
  onEditAction: (banner: Banner) => void;
  onAddNewAction: () => void;
}

export default function BannerList({ onEditAction, onAddNewAction }: BannerListProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBanners();
  }, [currentPage]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners);
    } catch (err) {
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bannerId }),
      });

      if (!res.ok) throw new Error('Failed to delete banner');

      setBanners(banners.filter((banner) => banner._id !== bannerId));
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  const handleToggleActive = async (bannerId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bannerId, isActive: !isActive }),
      });

      if (!res.ok) throw new Error('Failed to update banner status');

      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === bannerId ? { ...banner, isActive: !isActive } : banner
        )
      );
    } catch (err) {
      setError('Failed to update banner status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <button
            onClick={fetchBanners}
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
          Add New Banner
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
              {banners.map((banner) => (
                <tr key={banner._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                    {banner.description && (
                      <div className="text-sm text-gray-500">{banner.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(banner._id, banner.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditAction(banner)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
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
