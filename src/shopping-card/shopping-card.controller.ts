import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShoppingStatus } from './dto/shopping-status.dto';
import { ShoppingCardService } from './shopping-card.service';

@ApiTags('Shopping_Cart')
@Controller('buy')
export class ShoppingCardController {
  constructor(private readonly shoppingService: ShoppingCardService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Get()
  getShoppingProducts(@Request() req) {
    return this.shoppingService.getProductsPurchase(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post()
  buyProducts(@Request() req, @Body() status: ShoppingStatus) {
    return this.shoppingService.createPurchase(req.user.id, status);
  }
}