"use client";
import { useState } from 'react';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';

export default function CategoryManager() {
  const [refresh, setRefresh] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id?: string; name: string; description?: string } | null>(null);

  const handleSuccess = () => {
    setRefresh(r => r + 1);
    setIsFormVisible(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: { id: string; name: string; description?: string }) => {
    setEditingCategory(category);
    setIsFormVisible(true);
  };

  return (
    <div className="space-y-6">
      {isFormVisible && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <button 
              onClick={() => {
                setIsFormVisible(false);
                setEditingCategory(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <CategoryForm 
            initial={editingCategory || undefined} 
            onSuccess={handleSuccess} 
          />
        </div>
      )}
      
      <CategoryList 
        key={refresh} 
        onEdit={handleEdit} 
        onAddNew={() => {
          setEditingCategory(null);
          setIsFormVisible(true);
        }} 
      />
    </div>
  );
}