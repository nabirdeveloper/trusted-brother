"use client";

import { useState } from 'react';
import BannerForm from './BannerForm';
import BannerList from './BannerList';

export default function BannerManager() {
  const [refresh, setRefresh] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<{
    _id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    order: number;
  } | null>(null);

  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setIsFormVisible(false);
    setEditingBanner(null);
  };

  const handleEdit = (banner: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    order: number;
  }) => {
    setEditingBanner(banner);
    setIsFormVisible(true);
  };

  return (
    <div className="space-y-6">
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => {
                setIsFormVisible(false);
                setEditingBanner(null);
              }}
              className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
            >
              ×
            </button>
            <BannerForm
              initial={editingBanner || undefined}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      <BannerList
        key={refresh}
        onEditAction={handleEdit}
        onAddNewAction={() => {
          setEditingBanner(null);
          setIsFormVisible(true);
        }}
      />
    </div>
  );
}
