import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CartDto } from '../dto/cart.dto';
import { ShippingDto } from '../dto/shipping.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Post()
  async saveCart(@Body() newCart: CartDto): Promise<CartDto> {
    if (!newCart) {
      throw new BadRequestException('The body is empty');
    } else {
      return await this.service.save(newCart);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CartDto> {
    return await this.service.findOne(id);
  }

  @Delete(':id')
  async deleteCartById(@Param('id') id: string): Promise<any> {
    return await this.service.deleteCartById(id);
  }

  // rename cart id from to to
  @Get('/rename/:oldId/:newId')
  async updateCardId(
    @Param('oldId') oldId: string,
    @Param('newId') newId: string,
  ): Promise<CartDto> {
    return await this.service.updateCardId(oldId, newId);
  }

  // update/create cart
  // qty needs to be validated/ bypass old implementation
  @Get('/add/:id/:sku/:qty')
  async createCart(
    @Param('id') id: string,
    @Param('sku') sku: string,
    @Param('qty') qty: number,
  ): Promise<CartDto> {
    return await this.service.createCart(id, sku, qty);
  }

  // update quantity - remove item when qty == 0
  // qty needs to be validated/ bypass old implementation
  @Get('/update/:id/:sku/:qty')
  async updateCart(
    @Param('id') id: String,
    @Param('sku') sku: String,
    @Param('qty') qty: number,
  ): Promise<CartDto> {
    return await this.service.updateCart(id, sku, qty);
  }

  // add shipping
  @Post('/shipping/:id')
  async createShipping(
    @Param('id') id: String,
    @Body() shipping: ShippingDto,
  ): Promise<CartDto> {
    return await this.service.createShipping(id, shipping);
  }
}
