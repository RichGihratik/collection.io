import { SearchOptions } from '@/search';

export enum OrderByField {
  Name = 'name',
  Rating = 'rating',
  ItemCount = 'itemsCount',
}

export interface SearchOptionsDto extends SearchOptions {
  orderBy?: OrderByField;
  /**
   * @type int
   */
  userId?: number;
}
