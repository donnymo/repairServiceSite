import type { ReactNode } from 'react';

export type DetailRow = { label: string; value: ReactNode; hidden?: boolean };

/** Пустое значение показываем прочерком (или `placeholder`). */
export function Empty({ children = '—' }: { children?: ReactNode }) {
  return <span className="muted">{children}</span>;
}

export function DetailsPanel({ title, rows, children }: { title: string; rows: DetailRow[]; children?: ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <dl className="dl">
        {rows
          .filter((r) => !r.hidden)
          .map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
      </dl>
      {children}
    </section>
  );
}
