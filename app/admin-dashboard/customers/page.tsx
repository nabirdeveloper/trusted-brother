import AdminCustomerList from '../AdminCustomerList';

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Customers</h1>
      <AdminCustomerList />
    </div>
  );
}