import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/server/auth';
import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = { title: 'Вход в админ-панель', robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdmin()) redirect('/admin/orders');
  return (
    <main className="admin-login">
      <LoginForm />
    </main>
  );
}
