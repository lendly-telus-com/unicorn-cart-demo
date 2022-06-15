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
import { SearchParams } from '../dto/search.params';
import { ShippingDto } from '../dto/shipping.dto';
import { UpdateDto } from '../dto/update.dto';
import { Cart } from '../model/cart';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  //http://localhost:3000/cart
  @Post()
  async saveCart(@Body() newCart: CartDto): Promise<CartDto> {
    if (!newCart) {
      throw new BadRequestException('The body is empty');
    } else {
      return await this.service.save(newCart);
    }
  }

  //http://localhost:3000/cart/1
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CartDto> {
    return await this.service.findOne(id);
  }

  //http://localhost:3000/cart/1
  @Delete(':id')
  async deleteCartById(@Param('id') id: string): Promise<any> {
    return await this.service.deleteCartById(id);
  }

  //http://localhost:3000/cart/rename/11/12
  // rename cart id from to to
  @Get('/rename/:oldId/:newId')
  async updateCardId(
    @Param('oldId') oldId: string,
    @Param('newId') newId: string,
  ): Promise<CartDto> {
    return await this.service.updateCardId(oldId, newId);
  }

  //http://localhost:3000/cart/update
  // update/create cart
  @Post('/update')
  async updateCart(@Body() updateDto: UpdateDto): Promise<Cart> {
    return await this.service.updateCart(updateDto);
  }

  // update - validate quantity - remove item when qty == 0

  @Post('/validate')
  async validateCart(@Body() updateDto: UpdateDto): Promise<Cart> {
    return await this.service.validateCart(updateDto);
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
