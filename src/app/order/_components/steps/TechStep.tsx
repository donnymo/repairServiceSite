import { CategoryIcon, CheckIcon } from '@/components/icons';
import { BRANDS, OTHER_CATEGORY_SLUG, OTHER_PROBLEM } from '@/lib/constants';
import type { CategoryWithProblems } from '@/server/data/categories';
import { BRAND_OTHER, BRAND_UNKNOWN } from '../../_lib/form';
import type { StepProps } from './types';

const BRAND_OPTIONS = [...BRANDS, BRAND_OTHER, BRAND_UNKNOWN];

type Props = StepProps & {
  categories: CategoryWithProblems[];
  category: CategoryWithProblems | null;
};

export function TechStep({ form, update, field, categories, category }: Props) {
  if (!category) {
    return (
      <div className="option-grid">
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            className="option-card"
            onClick={() => update({ category: c.slug, problem: '', problemDetails: '' })}
          >
            <CategoryIcon slug={c.slug} size={44} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="selected-row">
        <span className="check-dot">
          <CheckIcon />
        </span>
        <strong>{category.name}</strong>
        <button
          type="button"
          className="btn-link"
          onClick={() => update({ category: '', problem: '', problemDetails: '', deviceType: '' })}
        >
          Изменить
        </button>
      </div>

      {category.slug === OTHER_CATEGORY_SLUG && (
        <div className="field">
          <label className="label" htmlFor="deviceType">
            Какая техника?
          </label>
          <input
            id="deviceType"
            className="input"
            type="text"
            autoComplete="off"
            enterKeyHint="next"
            placeholder="Например, микроволновая печь"
            {...field('deviceType')}
          />
        </div>
      )}

      <div className="field">
        <span className="label" id="brand-label">
          Производитель <span className="opt">— если знаете</span>
        </span>
        <div className="chips" role="group" aria-labelledby="brand-label">
          {BRAND_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              className="chip"
              aria-pressed={form.brand === b}
              onClick={() => update({ brand: form.brand === b ? '' : b })}
            >
              {b}
            </button>
          ))}
        </div>
        {form.brand === BRAND_OTHER && (
          <input
            className="input"
            type="text"
            aria-label="Производитель"
            placeholder="Название производителя"
            autoComplete="off"
            {...field('brandOther')}
          />
        )}
      </div>

      <div className="field">
        <span className="label" id="problem-label">
          Что случилось?
        </span>
        <div className="radio-list" role="group" aria-labelledby="problem-label">
          {category.problems.map((p) => (
            <button
              key={p}
              type="button"
              className="radio-item"
              aria-pressed={form.problem === p}
              onClick={() => update({ problem: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {form.problem === OTHER_PROBLEM && (
        <div className="field">
          <label className="label" htmlFor="problemDetails">
            Опишите проблему
          </label>
          <textarea
            id="problemDetails"
            className="textarea"
            rows={3}
            placeholder="Что происходит и когда это началось"
            {...field('problemDetails')}
          />
        </div>
      )}
    </>
  );
}
