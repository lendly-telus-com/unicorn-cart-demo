export interface Cart {
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
