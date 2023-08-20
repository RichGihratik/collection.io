import { SearchOptions } from '@/search';

export enum OrderByField {
  CreatedAt = 'createdAt',
  LikeCount = 'likeCount',
}

export interface SearchOptionsDto extends SearchOptions {
  orderBy?: OrderByField;
  /**
   * @type int
   */
  userId?: number;
  /**
   * @type int
   */
  collectionId?: number;
}
