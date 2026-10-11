'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListIcon, UsersIcon } from '@/components/icons';

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  const current = (prefix: string) => (pathname.startsWith(prefix) ? 'page' : undefined);

  return (
    <nav className="admin-nav" aria-label="Разделы">
      <Link href="/admin/orders" aria-current={current('/admin/orders')}>
        <ListIcon />
        <span className="grow">Заявки</span>
        {newCount > 0 && (
          <span className="badge" aria-label={`Новых: ${newCount}`}>
            {newCount}
          </span>
        )}
      </Link>
      <Link href="/admin/masters" aria-current={current('/admin/masters')}>
        <UsersIcon />
        <span className="grow">Мастера</span>
      </Link>
    </nav>
  );
}
