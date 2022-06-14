import { Cart } from '../model/cart';

export class CartDto implements Cart {
  id?: string;

  unit?: string;

  dateFrom?: Date;

  dateTo?: Date;

  sku?: string;

  name?: string;

  quantity?: number;

  price?: number;

  subtotal?: number;
}
