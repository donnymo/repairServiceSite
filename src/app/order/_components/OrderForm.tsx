'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react';
import type { BookingDay, Today } from '@/lib/dates';
import type { CategoryWithProblems } from '@/server/data/categories';
import { createOrder } from '../actions';
import {
  EMPTY_FORM,
  INPUT_STEPS_COUNT,
  STEPS,
  summarize,
  toOrderInput,
  validateStep,
  type FieldName,
  type FormState,
  type StepId,
} from '../_lib/form';
import { OrderSuccess } from './OrderSuccess';
import { OrderTopBar } from './OrderTopBar';
import { AddressStep } from './steps/AddressStep';
import { ContactsStep } from './steps/ContactsStep';
import { ReviewStep } from './steps/ReviewStep';
import { TechStep } from './steps/TechStep';
import { TimeStep } from './steps/TimeStep';
import type { StepProps } from './steps/types';

type Props = {
  categories: CategoryWithProblems[];
  initialCategory: string;
  /** Дни записи и текущий час считаются на сервере — в часовом поясе сервиса, как и при проверке заявки. */
  days: BookingDay[];
  today: Today;
};

type Done = { number: number; visitLabel: string };

const NETWORK_ERROR = 'Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз или позвоните нам.';

export function OrderForm({ categories, initialCategory, days, today }: Props) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, category: initialCategory });
  const [stepIndex, setStepIndex] = useState(0);
  const [returnToReview, setReturnToReview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState<Done | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const step = STEPS[stepIndex];

  // При смене шага — наверх и фокус на заголовок (для скринридеров). Кроме первой отрисовки.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [stepIndex, done]);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));
  const field = (name: FieldName) => ({
    name,
    value: form[name],
    onChange: (e: { target: { value: string } }) => update({ [name]: e.target.value }),
  });

  const category = categories.find((c) => c.slug === form.category) ?? null;
  const problem = validateStep(step.id, form, category);
  const summary = summarize(form, category);

  function goTo(id: StepId) {
    setShowErrors(false);
    setServerError('');
    setStepIndex(STEPS.findIndex((s) => s.id === id));
  }

  function next() {
    if (problem) {
      setShowErrors(true);
      if (problem.field) formRef.current?.querySelector<HTMLElement>(`[name="${problem.field}"]`)?.focus();
      return;
    }
    if (step.id === 'review') return submit();
    if (returnToReview) {
      setReturnToReview(false);
      return goTo('review');
    }
    goTo(STEPS[stepIndex + 1].id);
  }

  function back() {
    if (returnToReview) {
      setReturnToReview(false);
      return goTo('review');
    }
    if (stepIndex > 0) goTo(STEPS[stepIndex - 1].id);
  }

  function edit(id: StepId) {
    setReturnToReview(true);
    goTo(id);
  }

  function submit() {
    setServerError('');
    startTransition(async () => {
      try {
        const result = await createOrder(toOrderInput(form));
        if (result.ok) {
          setDone({ number: result.number, visitLabel: result.visitLabel });
        } else {
          setServerError(result.error);
          // Дни и текущий час могли устареть, пока страница была открыта, — запрашиваем свежие.
          // Состояние формы при этом сохраняется.
          router.refresh();
        }
      } catch {
        setServerError(NETWORK_ERROR);
      }
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    next();
  }

  if (done) {
    return (
      <OrderSuccess
        {...done}
        phone={form.phone}
        address={summary.address}
        tech={`${summary.tech} · ${summary.problem}`}
        headingRef={headingRef}
      />
    );
  }

  const stepProps: StepProps = { form, update, field };
  const submitLabel = pending
    ? 'Отправляем…'
    : step.id === 'review'
      ? 'Отправить заявку'
      : returnToReview
        ? 'Сохранить и вернуться'
        : step.id === 'contacts'
          ? 'Проверить заявку'
          : 'Далее';

  return (
    <form ref={formRef} className="order-shell" onSubmit={onSubmit} noValidate>
      <OrderTopBar onBack={stepIndex === 0 && !returnToReview ? undefined : back} />

      <div className="progress">
        <div className="progress-row">
          <span>
            {stepIndex < INPUT_STEPS_COUNT ? `Шаг ${stepIndex + 1} из ${INPUT_STEPS_COUNT}` : 'Последний шаг'}
          </span>
          <span>{step.label}</span>
        </div>
        <div className="progress-bar" aria-hidden="true">
          {STEPS.slice(0, INPUT_STEPS_COUNT).map((s, i) => (
            <span key={s.id} className={i <= stepIndex ? 'on' : undefined} />
          ))}
        </div>
      </div>

      <div className="order-body">
        <h1 ref={headingRef} tabIndex={-1}>
          {step.heading}
        </h1>
        {step.id === 'tech' && <TechStep {...stepProps} categories={categories} category={category} />}
        {step.id === 'address' && <AddressStep {...stepProps} />}
        {step.id === 'time' && <TimeStep {...stepProps} days={days} today={today} />}
        {step.id === 'contacts' && <ContactsStep {...stepProps} />}
        {step.id === 'review' && (
          <ReviewStep
            error={serverError}
            onEdit={edit}
            sections={[
              { step: 'tech', title: 'Техника', lines: [summary.tech, summary.problem] },
              { step: 'address', title: 'Адрес', lines: [summary.address, form.addressComment.trim()] },
              {
                step: 'time',
                title: 'Время выезда',
                lines: [days.find((d) => d.iso === form.visitDate)?.full ?? '', form.timeSlot],
              },
              { step: 'contacts', title: 'Контакты', lines: [form.clientName.trim(), form.phone, form.comment.trim()] },
            ]}
          />
        )}
      </div>

      <div className="order-actions">
        <button type="submit" className="btn btn-primary btn-block" disabled={pending}>
          {submitLabel}
        </button>
        {showErrors && problem && (
          <p className="hint" role="alert">
            {problem.message}
          </p>
        )}
      </div>
    </form>
  );
}
