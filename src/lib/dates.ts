/**
 * Даты выезда (@db.Date) храним и передаём как ISO-строку YYYY-MM-DD или как полночь UTC.
 * Модуль изоморфный: часовой пояс сервиса передаётся явно или читается из окружения на сервере.
 */
import { capitalize } from './format';

const MONTHS_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEKDAYS_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const WEEKDAYS_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

const DEFAULT_TIMEZONE = 'Europe/Moscow';

export const appTimeZone = () => process.env.APP_TIMEZONE || DEFAULT_TIMEZONE;

export type Today = { iso: string; hour: number };

/** Текущие дата (YYYY-MM-DD) и час в часовом поясе сервиса. */
export function nowInAppTz(timeZone = appTimeZone()): Today {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return { iso: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) };
}

export function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

export function dateToIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const d = isoToDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return dateToIso(d);
}

export function isValidIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = isoToDate(iso);
  return !Number.isNaN(d.getTime()) && dateToIso(d) === iso;
}

/** Дата выезда: «суббота, 3 октября» */
export function formatVisitDate(d: Date): string {
  return `${WEEKDAYS_FULL[d.getUTCDay()]}, ${formatDayMonth(d)}`;
}

/** «3 октября» */
export function formatDayMonth(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_GEN[d.getUTCMonth()]}`;
}

/** Дата выезда коротко: «сб, 03.10» */
export function formatVisitDateShort(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${weekdayShort(d)}, ${dd}.${mm}`;
}

export function weekdayShort(d: Date): string {
  return WEEKDAYS_SHORT[d.getUTCDay()];
}

/** Момент времени (создание, история): «02.10.2026, 14:05» в поясе сервиса. */
export function formatDateTime(d: Date, timeZone = appTimeZone()): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export type BookingDay = {
  iso: string;
  /** «Сегодня», «Завтра» или «Пн» */
  top: string;
  num: number;
  month: string;
  /** «Понедельник, 5 октября» */
  full: string;
};

/** Дни, доступные для записи, начиная с `todayIso`. */
export function buildBookingDays(todayIso: string, count: number): BookingDay[] {
  return Array.from({ length: count }, (_, i) => {
    const iso = addDaysIso(todayIso, i);
    const d = isoToDate(iso);
    const weekday = WEEKDAYS_SHORT[d.getUTCDay()];
    return {
      iso,
      top: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : capitalize(weekday),
      num: d.getUTCDate(),
      month: MONTHS_SHORT[d.getUTCMonth()],
      full: capitalize(formatVisitDate(d)),
    };
  });
}
