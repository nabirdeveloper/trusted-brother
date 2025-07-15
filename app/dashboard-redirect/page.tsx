import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

type SessionUserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default async function DashboardRedirectPage() {
  const session = await getServerSession(authOptions) as { user?: SessionUserWithRole } | null;
  if (!session || !session.user) {
    redirect('/auth/login');
  }
  if (session.user.role === 'admin') {
    redirect('/admin-dashboard');
  } else {
    redirect('/user-dashboard');
  }
  return null;
} 