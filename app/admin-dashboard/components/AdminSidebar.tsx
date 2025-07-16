"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBox, FaClipboardList, FaUsers, FaTags, FaChartBar, FaCog, FaSignOutAlt, FaTachometerAlt, FaStore, FaImages, FaPhotoVideo } from 'react-icons/fa';

const navLinks = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { href: '/admin-dashboard/marketplace', label: 'Marketplace', icon: <FaStore /> },
  { href: '/admin-dashboard/orders', label: 'Orders', icon: <FaClipboardList /> },
  { href: '/admin-dashboard/customers', label: 'Customers', icon: <FaUsers /> },
  { href: '/admin-dashboard/products', label: 'Products', icon: <FaBox /> },
  { href: '/admin-dashboard/categories', label: 'Categories', icon: <FaTags /> },
  { href: '/admin-dashboard/banners', label: 'Banners', icon: <FaImages /> },
  { href: '/admin-dashboard/category-sliders', label: 'Category Sliders', icon: <FaPhotoVideo /> },
  { href: '/admin-dashboard/analytics', label: 'Analytics', icon: <FaChartBar /> },
  { href: '/admin-dashboard/settings', label: 'Settings', icon: <FaCog /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen bg-white border-r flex flex-col w-64 fixed top-0 left-0 z-20">
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="w-8 h-8 bg-green-600 text-white rounded-md flex items-center justify-center font-bold">F</div>
        <span className="font-bold text-lg">Flup</span>
      </div>
      <div className="px-4 py-2 border-b">
        <div className="text-xs text-gray-500 mb-1">MARKETING</div>
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${pathname === link.href ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 py-4 border-t flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-green-600">H</div>
        <div className="flex-1">
          <div className="font-medium text-sm">Harper Nelson</div>
          <div className="text-xs text-gray-500">Admin Manager</div>
        </div>
      </div>
    </aside>
  );
}