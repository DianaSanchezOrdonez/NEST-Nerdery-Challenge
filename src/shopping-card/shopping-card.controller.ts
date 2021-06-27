import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShoppingStatus } from './dto/shopping-status.dto';
import { ShoppingCardService } from './shopping-card.service';

@Controller('buy')
export class ShoppingCardController {
  constructor(private readonly shoppingService: ShoppingCardService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getShoppingProducts(@Request() req) {
    return this.shoppingService.getProductsPurchase(req.user.id);
  }

  // @Get('paid')
  // getPaidProducts() {
  //   return this.shoppingService.getShoppingPaid();
  // }

  @UseGuards(JwtAuthGuard)
  @Post()
  buyProducts(@Request() req, @Body() status: ShoppingStatus) {
    return this.shoppingService.createPurchase(req.user.id, status);
  }
}
