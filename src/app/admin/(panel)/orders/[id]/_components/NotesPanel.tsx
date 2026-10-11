import type { OrderNote } from '@prisma/client';
import { formatDateTime } from '@/lib/dates';
import { addNote } from '../actions';

export function NotesPanel({ orderId, notes }: { orderId: number; notes: OrderNote[] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Внутренние комментарии</h2>
        <span className="muted text-sm">Клиент их не видит</span>
      </div>
      {notes.length === 0 ? (
        <p className="muted">Комментариев пока нет.</p>
      ) : (
        <div className="notes">
          {notes.map((n) => (
            <div key={n.id} className="note">
              <small>
                {n.author} · {formatDateTime(n.createdAt)}
              </small>
              {n.text}
            </div>
          ))}
        </div>
      )}
      <form action={addNote} className="stack stack-sm">
        <input type="hidden" name="orderId" value={orderId} />
        <label className="label text-sm" htmlFor="note">
          Новый комментарий
        </label>
        <textarea
          id="note"
          name="text"
          className="textarea"
          rows={3}
          required
          placeholder="Например: клиент просит позвонить за час до приезда"
        />
        <button type="submit" className="btn btn-dark align-start">
          Добавить комментарий
        </button>
      </form>
    </section>
  );
}
