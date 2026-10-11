import type { StepId } from '../../_lib/form';

type Section = { step: StepId; title: string; lines: string[] };

type Props = {
  sections: Section[];
  error: string;
  onEdit: (step: StepId) => void;
};

export function ReviewStep({ sections, error, onEdit }: Props) {
  return (
    <>
      <p className="muted review-lead">Если всё верно — отправляйте. Любой пункт можно изменить.</p>
      {sections.map((s) => (
        <ReviewCard key={s.step} title={s.title} lines={s.lines} onEdit={() => onEdit(s.step)} />
      ))}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
    </>
  );
}

function ReviewCard({ title, lines, onEdit }: { title: string; lines: string[]; onEdit: () => void }) {
  const [first, ...rest] = lines;
  return (
    <div className="review-card">
      <div>
        <small>{title}</small>
        <strong>{first}</strong>
        {rest.filter(Boolean).map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
      <button type="button" className="btn-link" onClick={onEdit} aria-label={`Изменить: ${title.toLowerCase()}`}>
        Изменить
      </button>
    </div>
  );
}
