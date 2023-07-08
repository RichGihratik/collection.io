import { DatabaseService, FieldType, Prisma } from '@collection.io/prisma';
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
      // From https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
      return typeof item === 'number' && (item | 0) === item;
  }
}

export type DatabaseClient = Parameters<
  Parameters<DatabaseService['$transaction']>[0]
>[0];

export enum SearchLang {
  Eng = 'english',
  Rus = 'russian',
}

export function prepareSearch(searchStr: string, lang: SearchLang) {
  return Prisma.sql`websearch_to_tsquery(${Prisma.raw(`'${lang}'`)}, ${
    searchStr + ':?'
  })`;
}
