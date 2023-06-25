import { FieldType } from '@collection.io/prisma';

export interface CollectionId {
  /**
   * @type int
   */
  id: number;
}

export interface CollectionProps {
  /**
   * @maxLength 30
   */
  name: string;

  description: string;

  /**
   * @type int
   */
  themeId: number | null;

  /**
   * @type int
   */
  ownerId: number;
}

export interface Field {
  /**
   * @maxLength 30
   */
  name: string;
  type: FieldType;
}
