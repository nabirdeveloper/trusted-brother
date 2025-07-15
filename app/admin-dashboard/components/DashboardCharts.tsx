"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, ReferenceLine } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

// Enhanced data structures with more realistic data
const salesData = [
  { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { name: 'Mar', revenue: 2000, expenses: 9800, profit: 1020 },
  { name: 'Apr', revenue: 2780, expenses: 3908, profit: 1872 },
  { name: 'May', revenue: 1890, expenses: 4800, profit: 1410 },
  { name: 'Jun', revenue: 2390, expenses: 3800, profit: 1990 },
  { name: 'Jul', revenue: 3490, expenses: 4300, profit: 2190 },
  { name: 'Aug', revenue: 3800, expenses: 3200, profit: 2300 },
  { name: 'Sep', revenue: 4500, expenses: 3500, profit: 2700 },
  { name: 'Oct', revenue: 4800, expenses: 3800, profit: 3000 },
  { name: 'Nov', revenue: 5000, expenses: 4000, profit: 3200 },
  { name: 'Dec', revenue: 5500, expenses: 4200, profit: 3300 },
];

const categoryData = [
  { name: 'Electronics', value: 30, color: '#8884d8' },
  { name: 'Clothing', value: 25, color: '#82ca9d' },
  { name: 'Home & Garden', value: 20, color: '#ffc658' },
  { name: 'Books', value: 15, color: '#0088FE' },
  { name: 'Beauty', value: 10, color: '#FF8042' },
];

const trafficSources = [
  { name: 'Direct', value: 40, color: '#00C49F' },
  { name: 'Organic Search', value: 30, color: '#FFBB28' },
  { name: 'Social Media', value: 15, color: '#FF8042' },
  { name: 'Email', value: 10, color: '#8884d8' },
  { name: 'Referral', value: 5, color: '#82ca9d' },
];

export default function DashboardCharts() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);

  // Mock API call (replace with actual API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between space-x-4 mb-4">
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
        <select 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="revenue">Revenue</option>
          <option value="expenses">Expenses</option>
          <option value="profit">Profit</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
                <ReferenceLine y={50} stroke="#000" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="font-bold">2.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Order Value</span>
              <span className="font-bold">$125.45</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Lifetime Value</span>
              <span className="font-bold">$1,250.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Net Promoter Score</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Response Time</span>
              <span className="font-bold">2h 30m</span>
            </div>
            <div className="flex justify-between">
              <span>Resolution Rate</span>
              <span className="font-bold">98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}