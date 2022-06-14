import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from 'redis';
import { CartDto } from '../dto/cart.dto';

const client = createClient();

@Injectable()
export class CartService {
  async save(newCart: CartDto): Promise<CartDto> {
    await client.connect();
    await client.setEx(newCart.id, 3600, JSON.stringify(newCart));

    //await client.disconnect()
    return newCart;
  }

  async findOne(id: string) {
    const result = await client.get(id);
    if (result === null) {
      throw new NotFoundException(`Cart with id ${id} could not be found`);
    }
    return JSON.parse(result);
  }

  async deleteCartById(id: any) {
    try {
      const result = await client.del(id);
      if (result === 0) {
        return new NotFoundException(`Cart with id ${id} could not be found`);
      }
      return 'Cart is successfully deleted';
    } catch (error) {
      throw new BadRequestException(
        'Error while running query on redis client',
      );
    }
  }

  async updateCardId(oldId: any, newId: any): Promise<string> {
    const result = await client.get(oldId);

    if (result === null) {
      throw new NotFoundException('Cart not found');
    }
    return client.rename(oldId, newId);
  }

  // update/create cart
  async createCart(id: any, sku: String, qty: number) {
    //todo calling Product catalog
    const product = {
      sku: 'sku234',
      inStock: 550,
      name: 'Susuki',
      price: 200,
    };
    if (product.inStock === 0) {
      throw new NotFoundException('Out of stock');
    }
    // call redis--
    const result = await client.get(id);
    let cart;
    if (result === null) {
      cart = {
        total: 0,
        tax: 0,
        items: [],
      };
    } else {
      cart = JSON.parse(result);
    }

    const item = {
      qty: qty,
      sku: sku,
      name: product.name,
      price: product.price,
      subtotal: qty * product.price,
    };

    const list = this.mergeList(cart.items, item, qty);
    cart.items = list;
    cart.total = this.calcTotal(cart.items);

    // work out tax
    cart.tax = this.calcTax(cart.total);
    await client.setEx(id, 3600, JSON.stringify(cart));
    return cart;
  }

  mergeList(
    list: any[],
    product: {
      qty?: number;
      sku: any;
      name?: string;
      price?: number;
      subtotal?: number;
    },
    qty: number,
  ) {
    const listBox = [];
    const isProductMerge = [];
    for (const i of list) {
      if (i.sku === product.sku) {
        const qtyNumber = +i.qty + +qty;
        console.log(qtyNumber);
        const item = {
          qty: qtyNumber,
          sku: product.sku,
          name: product.name,
          price: product.price,
          subtotal: qtyNumber * product.price,
        };
        listBox.push(item);
        isProductMerge.push(product);
      } else {
        listBox.push(i);
      }
    }

    if (isProductMerge.length === 0) {
      listBox.push(product);
    }

    return listBox;
  }

  calcTotal(list) {
    var total = 0;
    for (var idx = 0, len = list.length; idx < len; idx++) {
      total += list[idx].subtotal;
    }

    return total;
  }

  calcTax(total) {
    // tax @ 20%
    return total - total / 1.2;
  }
}
