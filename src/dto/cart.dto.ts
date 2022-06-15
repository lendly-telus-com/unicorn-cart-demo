import { IsInt, IsNotEmpty } from 'class-validator';
import { Cart } from '../model/cart';
import { Items } from '../model/items';

export class CartDto implements Cart {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @IsInt()
  total?: number;
  @IsNotEmpty()
  @IsInt()
  tax?: number;

  items?: Array<Items>;
}
