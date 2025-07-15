import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardChartsWrapper from "./components/DashboardChartsWrapper";

async function fetchDashboardStats() {
  // Placeholder: Replace with real API calls
  return {
    totalProducts: 567899,
    totalOrders: 1136,
    totalCustomers: 3465000,
    totalRevenue: 1789,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "admin") {
    redirect("/dashboard-redirect");
  }
  const stats = await fetchDashboardStats();
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Time period: Last 30 days</div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total customers</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</span>
              <span className="ml-2 text-xs text-green-500">+2.5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total revenue</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">${(stats.totalCustomers/1000000).toFixed(3)}M</span>
              <span className="ml-2 text-xs text-green-500">+0.5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total orders</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}M</span>
              <span className="ml-2 text-xs text-red-500">-0.2%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total returns</span>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</span>
              <span className="ml-2 text-xs text-green-500">+0.12%</span>
            </div>
          </div>
        </div>
      </div>
      
      <DashboardChartsWrapper />
    </div>
  );
}