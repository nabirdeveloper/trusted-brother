"use client";

import { useState } from 'react';
import CategorySliderForm from './CategorySliderForm';
import CategorySliderList, { CategorySlider } from './CategorySliderList';

export default function CategorySliderManager() {
  const [refresh, setRefresh] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSlider, setEditingSlider] = useState<{
    _id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    order: number;
    categoryId: string;
  } | null>(null);

  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setIsFormVisible(false);
    setEditingSlider(null);
  };

  const handleEdit = (slider: CategorySlider) => {
    // Convert the category object to categoryId for the form
    const editingData = {
      ...slider,
      categoryId: slider.category._id
    };
    setEditingSlider(editingData);
    setIsFormVisible(true);
  };

  return (
    <div className="space-y-6">
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button
              onClick={() => {
                setIsFormVisible(false);
                setEditingSlider(null);
              }}
              className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">{editingSlider ? 'Edit Category Slider' : 'Add New Category Slider'}</h2>
            <CategorySliderForm
              initial={editingSlider || undefined}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      <CategorySliderList
        key={refresh}
        onEditAction={handleEdit}
        onAddNewAction={() => {
          setEditingSlider(null);
          setIsFormVisible(true);
        }}
      />
    </div>
  );
}
