import { ObjectWithName } from '@/common';
import { ItemValues } from './item.dto';

interface ItemOptions {
  /**
   * @type string
   */
  tags: string[];

  fields: ItemValues;
}

export interface CreateItemDto extends ObjectWithName, ItemOptions {
  /**
   * @type int
   */
  collectionId: number;
}

export interface UpdateItemDto
  extends Partial<ItemOptions>,
    Partial<ObjectWithName> {}
