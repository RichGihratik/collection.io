import { Field, ObjectWithName } from '@/common';

export interface UpdateFieldsDto {
  create: Field[];
  update: Field[];
  delete: ObjectWithName[];
}
