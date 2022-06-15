import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedisConfig } from '../config/redis.config';
import { CartDto } from '../dto/cart.dto';
import { ShippingDto } from '../dto/shipping.dto';
import { UpdateDto } from '../dto/update.dto';
import { Cart } from '../model/cart';
import { Items } from '../model/items';

const client = new RedisConfig();
client.clientOn();

@Injectable()
export class CartService {
  constructor(private readonly redis: RedisConfig) {}

  async save(newCart: CartDto): Promise<CartDto> {
    const result = await this.redis.clientSave(
      newCart.id,
      3600,
      JSON.stringify(newCart),
    );
    if (!result) {
      throw new BadRequestException('something went wrong');
    }
    return newCart;
  }

  async findOne(id: string): Promise<CartDto> {
    const result = await this.redis.clientGet(id);
    if (result === null) {
      throw new NotFoundException(`Cart with id ${id} could not be found`);
    }
    return JSON.parse(result);
  }

  async deleteCartById(id: string): Promise<any> {
    try {
      const result = await this.redis.clientDelete(id);
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

  // rename cart id from old to new
  async updateCardId(oldId: string, newId: string): Promise<CartDto> {
    const result = await this.redis.clientGet(oldId);
    if (result === null) {
      throw new NotFoundException('Cart not found');
    }
    await this.redis.clientRenameKey(oldId, newId);
    const changeId = await this.redis.clientGet(newId);
    const parseChangeId = JSON.parse(changeId);
    parseChangeId.id = newId;
    await this.redis.clientSave(newId, 3600, JSON.stringify(parseChangeId));
    return parseChangeId;
  }

  // update/create cart
  async updateCart(updateDto: UpdateDto): Promise<Cart> {
    const { id, sku, qty } = updateDto;

    //todo calling Product catalog
    const product = {
      sku: 'sku123',
      inStock: 550,
      name: 'Susuki',
      price: 200,
    };
    if (product.inStock === 0) {
      throw new NotFoundException('Out of stock');
    }
    // call redis--
    const result = await this.redis.clientGet(id);
    let cart: Cart;
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
    await this.redis.clientSave(id, 3600, JSON.stringify(cart));
    return cart;
  }

  // update quantity - remove item when qty == 0
  async validateCart(updateDto: UpdateDto): Promise<Cart> {
    const { id, sku, qty } = updateDto;
    let cart: Cart;
    // call redis--sku
    const result = await this.redis.clientGet(id);

    if (result === null) {
      throw new NotFoundException('cart not found');
    }
    cart = JSON.parse(result);

    // remove item with 0 qty
    const itemWithMatchingSkuUpdateQty = [];
    const itemsWithGoodQty = [];
    for (const i of cart.items) {
      if (i.qty > 0) {
        itemsWithGoodQty.push(i);
      }
    }
    // update qty if match to sku
    for (const i of itemsWithGoodQty) {
      if (i.sku === sku) {
        const item = {
          qty: qty,
          sku: sku,
          name: i.name,
          price: i.price,
          subtotal: qty * i.price,
        };
        itemWithMatchingSkuUpdateQty.push(item);
      } else {
        itemWithMatchingSkuUpdateQty.push(i);
      }
    }
    cart.items = itemWithMatchingSkuUpdateQty;
    cart.total = this.calcTotal(cart.items);
    cart.tax = this.calcTax(cart.total);
    await this.redis.clientSave(id, 3600, JSON.stringify(cart));
    return cart;
  }

  async createShipping(id: any, shipping: ShippingDto): Promise<CartDto> {
    let cart: CartDto;
    // call redis--sku
    const result = await this.redis.clientGet(id);
    if (result === null) {
      throw new NotFoundException('cart not found');
    }
    cart = JSON.parse(result);
    const isShip = [];
    const item = {
      qty: 1,
      sku: 'SHIP',
      name: 'shipping to ' + shipping.location,
      price: shipping.cost,
      subtotal: shipping.cost,
    };
    // check shipping already in the cart if not set item Ship
    for (const i of cart.items) {
      if (i.sku === item.sku) {
        console.log('item was already shipped');
        isShip.push(i);
      } else {
        isShip.push(item);
      }
    }
    cart.items = isShip;
    cart.total = this.calcTotal(cart.items);
    cart.tax = this.calcTax(cart.total);
    await this.redis.clientSave(id, 3600, JSON.stringify(cart));
    return cart;
  }

  mergeList(
    list: Items[],
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
