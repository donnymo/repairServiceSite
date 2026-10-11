import { findTimeSlot, OTHER_CATEGORY_SLUG, OTHER_PROBLEM } from '@/lib/constants';
import { formatAddress } from '@/lib/format';
import type { CategoryWithProblems } from '@/server/data/categories';
import type { OrderInput } from '../schema';

export const BRAND_OTHER = 'Другой';
export const BRAND_UNKNOWN = 'Не знаю';

export const EMPTY_FORM = {
  category: '',
  deviceType: '',
  brand: '',
  brandOther: '',
  problem: '',
  problemDetails: '',
  city: '',
  street: '',
  house: '',
  flat: '',
  addressComment: '',
  visitDate: '',
  timeSlot: '',
  clientName: '',
  phone: '',
  comment: '',
  website: '',
};

export type FormState = typeof EMPTY_FORM;
export type FieldName = keyof FormState;

export const STEPS = [
  { id: 'tech', label: 'Техника', heading: 'Что нужно отремонтировать?' },
  { id: 'address', label: 'Адрес', heading: 'Куда приехать мастеру?' },
  { id: 'time', label: 'Время', heading: 'Когда удобно принять мастера?' },
  { id: 'contacts', label: 'Контакты', heading: 'Как с вами связаться?' },
  { id: 'review', label: 'Проверка', heading: 'Проверьте заявку' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

/** Шагов с вводом данных — без итоговой проверки. */
export const INPUT_STEPS_COUNT = STEPS.length - 1;

export type StepProblem = { field?: FieldName; message: string };

/** Проверка шага на клиенте — чтобы подсказать и сфокусировать поле. Окончательная проверка — на сервере. */
export function validateStep(step: StepId, f: FormState, category: CategoryWithProblems | null): StepProblem | null {
  switch (step) {
    case 'tech':
      if (!category) return { message: 'Выберите технику' };
      if (category.slug === OTHER_CATEGORY_SLUG && !f.deviceType.trim())
        return { field: 'deviceType', message: 'Укажите, какая техника' };
      if (!f.problem) return { message: 'Выберите, что случилось' };
      if (f.problem === OTHER_PROBLEM && !f.problemDetails.trim())
        return { field: 'problemDetails', message: 'Опишите проблему' };
      return null;
    case 'address':
      if (!f.city.trim()) return { field: 'city', message: 'Укажите город' };
      if (!f.street.trim()) return { field: 'street', message: 'Укажите улицу' };
      if (!f.house.trim()) return { field: 'house', message: 'Укажите дом' };
      return null;
    case 'time':
      if (!f.visitDate) return { message: 'Выберите дату' };
      if (!findTimeSlot(f.timeSlot)) return { message: 'Выберите интервал' };
      return null;
    case 'contacts':
      if (!f.clientName.trim()) return { field: 'clientName', message: 'Укажите имя' };
      if (f.phone.replace(/\D/g, '').length !== 11) return { field: 'phone', message: 'Введите телефон полностью' };
      return null;
    case 'review':
      return null;
  }
}

function brandValue(f: FormState): string {
  if (f.brand === BRAND_OTHER) return f.brandOther.trim();
  if (f.brand === BRAND_UNKNOWN) return '';
  return f.brand;
}

export function toOrderInput(f: FormState): OrderInput {
  const { category, brandOther: _brandOther, ...rest } = f;
  return { ...rest, categorySlug: category, brand: brandValue(f) };
}

/** Строки для экрана проверки и экрана «Заявка отправлена». */
export function summarize(f: FormState, category: CategoryWithProblems | null) {
  const deviceName =
    category?.slug === OTHER_CATEGORY_SLUG && f.deviceType.trim() ? f.deviceType.trim() : category?.name;
  const details = f.problemDetails.trim();
  return {
    tech: [deviceName, brandValue(f)].filter(Boolean).join(', '),
    problem: f.problem === OTHER_PROBLEM && details ? `${f.problem}: ${details}` : f.problem,
    address: formatAddress(f),
  };
}
