import { Items } from './items';

export interface Cart {
  id?: string;

  total?: number;

  tax?: number;

  items?: Array<Items>;
}
