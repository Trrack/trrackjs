import { BrandedId } from '../utils/branded_types';

export type NodeId = BrandedId<string, 'Node'>;

export type AuthorId = BrandedId<string, 'Author'>;

export type ActionId = BrandedId<string, 'Action'>;
