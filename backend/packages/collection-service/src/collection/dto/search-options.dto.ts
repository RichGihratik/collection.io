export enum OrderByField {
  Name = 'name',
  Rating = 'rating',
  ItemCount = 'itemsCount',
}

export enum OrderByType {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export interface SearchOptionsDto {
  /**
   * @maxLength 200
   */
  searchBy?: string;

  orderBy?: OrderByField;
  orderType?: OrderByType;

  /**
   * @type int
   */
  limit?: number;
  /**
   * @type int
   */
  userId?: number;
  /**
   * @type int
   */
  offset?: number;
}
