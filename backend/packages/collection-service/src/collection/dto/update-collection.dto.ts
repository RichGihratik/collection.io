import { ObjectWithId } from '@/common';
import { CollectionProps } from './common';

export interface UpdateCollectionDto
  extends ObjectWithId,
    Partial<CollectionProps> {}
