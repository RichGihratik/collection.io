import { ObjectWithId, ObjectWithName, Field } from '@/common';

export interface Owner extends ObjectWithId, ObjectWithName {}

export interface CollectionDto extends ObjectWithId, ObjectWithName {
  theme: string;
  owner: Owner;

  /**
   * @format url
   */
  imageUrl?: string;

  /**
   * @type int
   */
  itemsCount: number;

  /**
   * @minimum 0
   * @maximun 5
   */
  rating: number;

  /**
   * @type int
   */
  votesCount: number;
}

export interface CollectionFullInfoDto extends CollectionDto {
  /**
   * @type int
   * @minimum 0
   * @maximun 5
   */
  viewerRating?: number;
  description: string;
  fields: Field[];
}
