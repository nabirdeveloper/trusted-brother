"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
// Update the import path below to the correct location of your tabs components.
// Example if the file is at components/ui/Tabs.tsx:
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminProductForm = dynamic(() => import("../AdminProductForm"), { ssr: false });
const AdminProductList = dynamic(() => import("../AdminProductList"), { ssr: false });
const AdminOrderList = dynamic(() => import("../AdminOrderList"), { ssr: false });
const AdminCategoryList = dynamic(() => import("../AdminCategoryList"), { ssr: false });
const AdminUserList = dynamic(() => import("../AdminUserList"), { ssr: false });

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock statistics data (replace with actual API calls)
  const stats = {
    totalProducts: 125,
    pendingOrders: 15,
    recentSales: 35,
    totalUsers: 500
  };

  return (
    <main className="flex flex-col space-y-6 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
            <div className="text-2xl font-bold">{stats.recentSales}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="space-y-6">
            <AdminProductForm />
            <AdminProductList />
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <AdminOrderList />
        </TabsContent>
        <TabsContent value="categories">
          <AdminCategoryList />
        </TabsContent>
        <TabsContent value="users">
          <AdminUserList />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" className="w-full">
          Quick Actions
        </Button>
      </div>
    </main>
  );
}
