"use client";
import { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface CategoryListProps {
  onEditAction: (category: { id: string; name: string; description?: string }) => void;
  onAddNewAction: () => void;
}

export default function CategoryList({ onEditAction, onAddNewAction }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      console.log('Categories data:', data); // Debug the response
      setCategories(data.categories || []);
    } catch {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete category');
      }
    } catch {
      setError('Failed to delete category');
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredCategories.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

console.log('Rendering categories with keys:', paginatedCategories.map(c => c._id));
  return (
    <div className="bg-white rounded shadow w-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search categories"
              className="pl-8 pr-4 py-2 border rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button 
            onClick={onAddNewAction}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>
      </div>
      
      {error && <div className="text-red-500 p-4">{error}</div>}
      
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pl-4 py-3 w-8">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="py-3">Category ID</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Description</th>
                  <th className="py-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="pl-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-4 text-sm text-gray-600">{category._id ? `#CAT-${category._id.substring(0, 6)}` : 'N/A'}</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">{category.name ? category.name.charAt(0) : '?'}</span>
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{category.description || '-'}</td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEditAction({ id: category._id, name: category.name, description: category.description })}
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCategories.length > 0 ? (
            <div className="p-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + paginatedCategories.length, filteredCategories.length)} of {filteredCategories.length} categories
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  className="px-2 py-1 border rounded text-sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button
                  className="px-2 py-1 border rounded text-sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(filteredCategories.length / itemsPerPage)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={`page-btn-${pageNum}-curr-${currentPage}`}
                      className={`px-3 py-1 border rounded text-sm ${currentPage === pageNum ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  className="px-2 py-1 border rounded text-sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(filteredCategories.length / itemsPerPage)}
                >
                  ›
                </button>
                <button
                  className="px-2 py-1 border rounded text-sm"
                  onClick={() => handlePageChange(Math.ceil(filteredCategories.length / itemsPerPage))}
                  disabled={currentPage >= Math.ceil(filteredCategories.length / itemsPerPage)}
                >
                  »
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No categories found. {searchQuery ? 'Try a different search term.' : 'Add your first category.'}
            </div>
          )}
        </>
      )}
    </div>
  );
}