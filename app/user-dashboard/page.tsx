import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default async function UserDashboard() {
  const session = await getServerSession(authOptions) as { user?: SessionUser } | null;
  if (!session || !session.user) {
    redirect('/auth/login');
  }
  if (session.user.role !== 'user') {
    redirect('/dashboard-redirect');
  }
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p>Welcome, {session.user.name || 'User'}!</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </main>
  );
} 