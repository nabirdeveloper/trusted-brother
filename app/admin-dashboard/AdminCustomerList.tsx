"use client";
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Customer {
  _id: string;
  name: string;
  email: string;
  totalOrders?: number;
  totalSpent?: number;
  country?: string;
}

export default function AdminCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');

  // Mock data for demonstration
  const mockCustomers: Customer[] = [
    { _id: '1', name: 'Rokib Kovachar', email: 'hellorokib.rk@gmail.com', totalOrders: 138, totalSpent: 24068, country: 'Switzerland' },
    { _id: '2', name: 'Kelly Smith', email: 'kelly098@gmail.com', totalOrders: 45, totalSpent: 4234, country: 'United States' },
    { _id: '3', name: 'Tyler Nick', email: 'tyler.nick@gmail.com', totalOrders: 24, totalSpent: 6087, country: 'Austria' },
    { _id: '4', name: 'Angela Mao', email: 'angela.mao@gmail.com', totalOrders: 12, totalSpent: 1490, country: 'United States' },
    { _id: '5', name: 'Liam Himay', email: 'liamhoo@gmail.com', totalOrders: 24, totalSpent: 3094, country: 'Brazil' },
    { _id: '6', name: 'Lucy Style', email: 'lucy.style@gmail.com', totalOrders: 65, totalSpent: 9381, country: 'India' },
    { _id: '7', name: 'Umar Erdogan', email: 'umarerd.gr@gmail.com', totalOrders: 4, totalSpent: 569, country: 'Turkey' },
    { _id: '8', name: 'Helen Noel', email: 'helen.noel@gmail.com', totalOrders: 12, totalSpent: 2930, country: 'Canada' },
    { _id: '9', name: 'Daniel Tyler', email: 'daniel.dt@gmail.com', totalOrders: 90, totalSpent: 12901, country: 'Germany' },
  ];

  const fetchCustomers = async () => {
    setLoading(true);
    // In a real app, you would fetch from API
    // const res = await fetch('/api/customers');
    // const data = await res.json();
    // setCustomers(data.customers);
    
    // Using mock data for now
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredCustomers = customers
    .filter(customer => {
      if (selectedTab === 'All') return true;
      if (selectedTab === 'Deleted') return false; // No deleted customers in mock data
      return true;
    })
    .filter(customer => {
      if (!searchQuery) return true;
      return (
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredCustomers.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded shadow w-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Customers</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'All' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('All')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${selectedTab === 'Deleted' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('Deleted')}
            >
              Deleted
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search by ID, Name"
                className="pl-8 pr-4 py-2 border rounded-md w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Customer
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
                  <th className="py-3">Client Photo + Name</th>
                  <th className="py-3">Customer ID</th>
                  <th className="py-3">Email / Phone</th>
                  <th className="py-3">Total Orders</th>
                  <th className="py-3">Total Spent</th>
                  <th className="py-3">Country</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="pl-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">{customer.name.charAt(0)}</span>
                        </div>
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{`#CLIS-00${customer._id}`}</td>
                    <td className="py-4 text-sm">{customer.email}</td>
                    <td className="py-4 text-sm">{customer.totalOrders}</td>
                    <td className="py-4 text-sm">${customer.totalSpent?.toLocaleString()}</td>
                    <td className="py-4 text-sm">{customer.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              Showing 1-{paginatedCustomers.length} of {filteredCustomers.length} entries
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
              {Array.from({ length: Math.min(5, Math.ceil(filteredCustomers.length / itemsPerPage)) }, (_, i) => (
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
                disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
              >
                ›
              </button>
              <button
                className="px-2 py-1 border rounded text-sm"
                onClick={() => handlePageChange(Math.ceil(filteredCustomers.length / itemsPerPage))}
                disabled={currentPage >= Math.ceil(filteredCustomers.length / itemsPerPage)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}