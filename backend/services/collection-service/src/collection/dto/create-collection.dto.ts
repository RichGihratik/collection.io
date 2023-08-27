import { Field } from '@/common';
import { CollectionProps } from './common';

export interface CreateCollectionDto extends CollectionProps {
  fields: Field[];
}
