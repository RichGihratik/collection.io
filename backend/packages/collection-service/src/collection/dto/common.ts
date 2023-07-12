import { ObjectWithName } from '@/common';

export interface CollectionProps extends ObjectWithName {
  description: string;

  /**
   * @format url
   */
  imageUrl?: string;

  themeName: string | null;

  /**
   * @type int
   */
  ownerId: number;
}
