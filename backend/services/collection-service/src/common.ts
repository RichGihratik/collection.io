import { DatabaseService, FieldType } from '@collection.io/prisma';
import { isDate } from 'util/types';

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

export function isValidField(item: unknown, type: FieldType): boolean {
  switch (type) {
    case FieldType.BOOL:
      return typeof item === 'boolean';
    case FieldType.RICH_TEXT:
    case FieldType.TEXT:
      return typeof item === 'string';
    case FieldType.DATE:
      return isDate(item);
    case FieldType.INT:
      return typeof item === 'number' && Number.isInteger(item);
  }
}

export type DatabaseClient = Parameters<
  Parameters<DatabaseService['$transaction']>[0]
>[0];
