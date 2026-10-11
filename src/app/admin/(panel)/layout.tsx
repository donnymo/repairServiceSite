import type { Metadata } from 'next';
import { LogoutIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { requireAdmin } from '@/server/auth';
import { countNewOrders } from '@/server/data/orders';
import { logout } from '../actions';
import { AdminNav } from './_components/AdminNav';

export const metadata: Metadata = { title: 'Админ-панель', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: LayoutProps<'/admin'>) {
  const admin = await requireAdmin();
  const newCount = await countNewOrders();

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <Logo size={32} dark />
        </div>
        <AdminNav newCount={newCount} />
        <div className="admin-user">
          <span>{admin.email}</span>
          <form action={logout}>
            <button type="submit" className="icon-btn" aria-label="Выйти">
              <LogoutIcon />
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
