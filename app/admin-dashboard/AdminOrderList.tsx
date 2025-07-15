"use client";
import { useEffect, useState } from 'react';
import { FaSearch, FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Order {
  _id: string;
  user: { name: string; email: string };
  products: Array<{ product: { name: string; price: number; category: string }; quantity: number }>;
  total: number;
  status: string;
  createdAt: string;
  orderId?: string;
}

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      // Add orderId for display purposes
      const ordersWithId = data.orders.map((order: Order, index: number) => ({
        ...order,
        orderId: `#ORD-${String(index + 1001).padStart(6, '0')}`
      }));
      setOrders(ordersWithId);
    } catch (err) {
      setError('Failed to load orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? { ...order, status: newStatus } : order
      ));
      
      // Close the modal
      setIsStatusModalOpen(false);
      setNewStatus('');
    } catch (err) {
      setError('Failed to update order status');
    }
    setUpdatingStatus(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span>;
      case 'paid':
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Paid</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">Shipped</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  // Filter orders based on selected tab and search query
  const filteredOrders = orders.filter(order => {
    // Filter by tab
    if (selectedTab !== 'All' && order.status.toLowerCase() !== selectedTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(query) ||
        order.user.name.toLowerCase().includes(query) ||
        order.user.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredOrders.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
    setActionMenuOpen(null);
  };

  const toggleActionMenu = (orderId: string) => {
    if (actionMenuOpen === orderId) {
      setActionMenuOpen(null);
    } else {
      setActionMenuOpen(orderId);
    }
  };

  return (
    <div className="bg-white rounded shadow w-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'All' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('All')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Pending')}
            >
              Pending
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Paid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Paid')}
            >
              Paid
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Shipped')}
            >
              Shipped
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Completed')}
            >
              Completed
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Cancelled' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search by Order ID, Customer"
                className="pl-8 pr-4 py-2 border rounded-md w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Order
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">November 2024</span>
          </div>
          
          <button className="text-sm text-gray-600 border px-3 py-1 rounded-md">
            Export
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
                  <th className="py-3">Customer</th>
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Products</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="pl-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-4">
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{order.orderId}</td>
                    <td className="py-4 text-sm">
                      <ul className="list-disc list-inside">
                        {order.products.slice(0, 2).map((item, idx) => (
                          <li key={idx}>{item.product.name} (x{item.quantity})</li>
                        ))}
                        {order.products.length > 2 && (
                          <li>+{order.products.length - 2} more items</li>
                        )}
                      </ul>
                    </td>
                    <td className="py-4 text-sm font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-4 text-sm">{getStatusBadge(order.status)}</td>
                    <td className="py-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="relative inline-block">
                        <button 
                          onClick={() => toggleActionMenu(order._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaEllipsisV />
                        </button>
                        
                        {actionMenuOpen === order._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => openDetailsModal(order)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaEye className="mr-2" /> View Details
                              </button>
                              <button
                                onClick={() => openStatusModal(order)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FaEdit className="mr-2" /> Update Status
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(startIndex + paginatedOrders.length, filteredOrders.length)} of {filteredOrders.length} entries
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
              {Array.from({ length: Math.min(5, Math.ceil(filteredOrders.length / itemsPerPage)) }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1 ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                className="px-2 py-1 border rounded text-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
              >
                ›
              </button>
              <button
                className="px-2 py-1 border rounded text-sm"
                onClick={() => handlePageChange(Math.ceil(filteredOrders.length / itemsPerPage))}
                disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Order Details</h3>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Order Information</h4>
                  <p className="mb-1"><span className="font-medium">Order ID:</span> {selectedOrder.orderId}</p>
                  <p className="mb-1"><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="mb-1"><span className="font-medium">Status:</span> {getStatusBadge(selectedOrder.status)}</p>
                  <p className="mb-1"><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                  <p className="mb-1"><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                  <p className="mb-1"><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-gray-500 mb-2">Products</h4>
              <div className="border rounded-md overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Quantity</th>
                      <th className="px-6 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.products.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{item.product.category}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">${item.product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-sm font-medium text-right">Total</td>
                      <td className="px-6 py-3 text-sm font-medium text-right">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openStatusModal(selectedOrder);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Update Order Status</h3>
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="mb-4">Order: {selectedOrder.orderId}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm"
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}