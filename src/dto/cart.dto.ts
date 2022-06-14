import { Cart } from '../model/cart';
import { Items } from '../model/items';

export class CartDto implements Cart {
  id?: string;

  total?: number;

  tax?: number;

  items?: Array<Items>;
}
