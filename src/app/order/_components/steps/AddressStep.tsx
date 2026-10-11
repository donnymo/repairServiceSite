import type { StepProps } from './types';

export function AddressStep({ field }: StepProps) {
  return (
    <>
      <div className="field">
        <label className="label" htmlFor="city">
          Город
        </label>
        <input
          id="city"
          className="input"
          type="text"
          autoComplete="address-level2"
          enterKeyHint="next"
          placeholder="Город"
          {...field('city')}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="street">
          Улица
        </label>
        <input
          id="street"
          className="input"
          type="text"
          autoComplete="address-line1"
          enterKeyHint="next"
          placeholder="Например, ул. Ленина"
          {...field('street')}
        />
      </div>
      <div className="row-2">
        <div className="field">
          <label className="label" htmlFor="house">
            Дом
          </label>
          <input
            id="house"
            className="input"
            type="text"
            autoComplete="off"
            enterKeyHint="next"
            placeholder="12к1"
            {...field('house')}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="flat">
            Квартира
          </label>
          <input
            id="flat"
            className="input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="next"
            placeholder="45"
            {...field('flat')}
          />
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="addressComment">
          Комментарий к адресу <span className="opt">— необязательно</span>
        </label>
        <textarea
          id="addressComment"
          className="textarea"
          rows={2}
          placeholder="Подъезд, этаж, код домофона"
          {...field('addressComment')}
        />
      </div>
    </>
  );
}
