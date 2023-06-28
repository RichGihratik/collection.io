import { FieldType } from '@collection.io/prisma';

export interface ObjectWithId {
  /**
   * @type int
   */
  id: number;
}

export interface ObjectWithName {
  /**
   * @maxLength 30
   */
  name: string;
}

export interface Field extends ObjectWithName {
  type: FieldType;
}
