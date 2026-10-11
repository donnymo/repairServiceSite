import type { ChangeEvent } from 'react';
import type { FieldName, FormState } from '../../_lib/form';

export type FieldBinding = {
  name: FieldName;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type StepProps = {
  form: FormState;
  update: (patch: Partial<FormState>) => void;
  /** value + onChange + name для управляемого поля */
  field: (name: FieldName) => FieldBinding;
};
