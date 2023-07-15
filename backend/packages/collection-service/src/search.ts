import { Prisma } from '@collection.io/prisma';

export enum SearchLang {
  Eng = 'english',
  Rus = 'russian',
}

export function prepareSearch(searchStr: string, lang: SearchLang) {
  const convertedStr = searchStr.trim().split(/\s+/).join(' | ') + ':*';
  return Prisma.sql`to_tsquery(${Prisma.raw(`'${lang}'`)}, ${convertedStr})`;
}

export enum OrderByType {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export interface SearchOptions {
  /**
   * @maxLength 200
   */
  searchBy?: string;

  orderType?: OrderByType;

  /**
   * @type int
   */
  limit?: number;

  /**
   * @type int
   */
  offset?: number;
}
