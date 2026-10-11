type AddressParts = {
  city?: string | null;
  street: string;
  house: string;
  flat?: string | null;
};

/** «Москва, ул. Ленина, д. 12, кв. 45». Без city — короткий вариант для таблиц. */
export function formatAddress({ city, street, house, flat }: AddressParts): string {
  return [city?.trim(), street.trim(), house.trim() && `д. ${house.trim()}`, flat?.trim() && `кв. ${flat.trim()}`]
    .filter(Boolean)
    .join(', ');
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
