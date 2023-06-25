import { CollectionId, Field, CollectionProps } from './common';

export interface CreateCollectionDto extends CollectionId, CollectionProps {
  fields: Field[];
}
