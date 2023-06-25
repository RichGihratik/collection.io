import { CollectionId, CollectionProps } from './common';

export interface UpdateCollectionDto
  extends CollectionId,
    Partial<CollectionProps> {}
