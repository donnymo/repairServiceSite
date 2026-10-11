/** Приводит ввод к виду +7XXXXXXXXXX. Возвращает null, если это не российский номер из 11 цифр. */
export function normalizePhone(input: string): string | null {
  let digits = String(input ?? '').replace(/\D/g, '');
  if (digits.length === 10) digits = '7' + digits;
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits.length !== 11 || !digits.startsWith('7')) return null;
  return '+' + digits;
}

/** Маска ввода: из любых цифр строит «+7 (XXX) XXX-XX-XX» по мере набора. */
export function maskPhone(digitsInput: string): string {
  let d = digitsInput.replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  let r = '+7';
  if (d.length > 1) r += ' (' + d.slice(1, 4);
  if (d.length >= 4) r += ')';
  if (d.length > 4) r += ' ' + d.slice(4, 7);
  if (d.length > 7) r += '-' + d.slice(7, 9);
  if (d.length > 9) r += '-' + d.slice(9, 11);
  return r;
}

/** +79001234567 → +7 (900) 123-45-67 */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  return d.length === 11 ? maskPhone(d) : phone;
}
