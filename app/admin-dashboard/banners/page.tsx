import BannerManager from './BannerManager';

export default function AdminBannersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Banners</h1>
      <BannerManager />
    </div>
  );
}
