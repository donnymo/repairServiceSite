import type { OrderHistory } from '@prisma/client';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime } from '@/lib/dates';

export function HistoryPanel({ history }: { history: OrderHistory[] }) {
  return (
    <section className="panel">
      <h2>История изменений</h2>
      <ol className="timeline">
        {history.map((h) => (
          <li key={h.id}>
            <small>
              {formatDateTime(h.createdAt)} · {h.author}
            </small>
            <span className="line">
              <span>{h.message}</span>
              {h.status && <StatusBadge status={h.status} />}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
