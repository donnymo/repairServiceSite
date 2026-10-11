import type { OrderStatus } from '@prisma/client';
import { STATUS_LABELS } from '@/lib/constants';

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="status" data-status={status}>
      {STATUS_LABELS[status]}
    </span>
  );
}
