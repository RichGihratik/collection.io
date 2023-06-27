import { Field } from '@/common';
import { sanitize } from 'isomorphic-dompurify';

export function sanitizeFields(fields: Field[]) {
  return fields.map((field) => ({ ...field, name: sanitize(field.name) }));
}
