import { FieldType } from '@collection.io/prisma';

export interface ObjectWithId {
  /**
   * @type int
   */
  id: number;
}

export interface Field {
  /**
   * @maxLength 30
   */
  name: string;
  type: FieldType;
}
