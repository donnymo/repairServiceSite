import type { OrderStatus } from '@prisma/client';

/** Порядок статусов в фильтрах и при смене статуса. Цвета — в globals.css, `[data-status]`. */
export const ORDER_STATUSES = [
  'NEW',
  'ACCEPTED',
  'MASTER_ASSIGNED',
  'MASTER_ON_WAY',
  'DONE',
  'CANCELLED',
] as const satisfies readonly OrderStatus[];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Новая',
  ACCEPTED: 'Принята',
  MASTER_ASSIGNED: 'Назначен мастер',
  MASTER_ON_WAY: 'Мастер выехал',
  DONE: 'Выполнена',
  CANCELLED: 'Отменена',
};

export const CLOSED_STATUSES: readonly OrderStatus[] = ['DONE', 'CANCELLED'];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

/** Заранее заданные интервалы выезда. Час начала нужен, чтобы скрывать прошедшие интервалы «сегодня». */
export const TIME_SLOTS = [
  { value: '09:00–12:00', label: 'Утро', startHour: 9 },
  { value: '12:00–15:00', label: 'День', startHour: 12 },
  { value: '15:00–18:00', label: 'После обеда', startHour: 15 },
  { value: '18:00–21:00', label: 'Вечер', startHour: 18 },
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export const findTimeSlot = (value: unknown): TimeSlot | undefined => TIME_SLOTS.find((s) => s.value === value);

/** Интервал закрыт, если это «сегодня» и его начало уже наступило. */
export const isSlotPast = (slot: TimeSlot, dateIso: string, today: { iso: string; hour: number }) =>
  dateIso === today.iso && today.hour >= slot.startHour;

/** На сколько дней вперёд можно записаться (включая сегодня). */
export const BOOKING_DAYS = 7;

export const BRANDS = ['Bosch', 'Samsung', 'LG', 'Indesit', 'Electrolux', 'Atlant', 'Haier'];

/** Индексы как у Date#getDay(): 0 — воскресенье. Порядок вывода — с понедельника. */
export const WEEKDAYS = [
  { value: 1, short: 'Пн' },
  { value: 2, short: 'Вт' },
  { value: 3, short: 'Ср' },
  { value: 4, short: 'Чт' },
  { value: 5, short: 'Пт' },
  { value: 6, short: 'Сб' },
  { value: 0, short: 'Вс' },
] as const;

export const OTHER_PROBLEM = 'Другая проблема';
export const OTHER_CATEGORY_SLUG = 'other';
