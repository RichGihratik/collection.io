export enum OrderByField {
  Name = 'name',
  Rating = 'rating',
  ItemCount = 'itemCount',
}

export enum OrderByType {
  Ascending = 'asc',
  Descending = 'desc',
}

export interface SearchOptionsDto {
  /**
   * @maxLength 200
   */
  searchBy?: string;
  orderBy?: {
    type: OrderByType;
    field: OrderByField;
  };
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
