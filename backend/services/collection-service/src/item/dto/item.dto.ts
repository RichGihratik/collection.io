import { FieldType } from '@collection.io/prisma';
import { ObjectWithId, ObjectWithName } from '@/common';

export type ItemRawValues = Record<
  string,
  {
    type: FieldType;
    value: string;
  }
>;

export type ItemValues = Record<string, boolean | number | string | Date>;

interface CollectionInfo extends ObjectWithId, ObjectWithName {}

interface OwnerInfo extends ObjectWithId, ObjectWithName {
  avatarUrl?: string;
}

export interface Item extends ObjectWithId, ObjectWithName {
  tags: string[];
  values: ItemRawValues;
  collection: CollectionInfo;

  owner: OwnerInfo;

  createdAt: Date;

  /**
   * @type int
   */
  likeCount: number;

  /**
   * @type int
   */
  dislikeCount: number;

  /**
   * @type int
   */
  commentsCount: number;
}
