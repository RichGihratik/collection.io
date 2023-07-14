import { ObjectWithName } from '@/common';
import { ItemValues } from './item.dto';

export interface CreateItemDto extends ObjectWithName {
  /**
   * @type int
   */
  collectionId: number;

  /**
   * @type string
   */
  tags: string[];

  fields: ItemValues;
}
