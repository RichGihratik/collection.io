import { ObjectWithId, Field } from '@/common';

interface FieldsWithId extends Field, ObjectWithId {}

export interface UpdateFieldsDto {
  create: Field[];
  update: FieldsWithId[];
  delete: ObjectWithId[];
}
