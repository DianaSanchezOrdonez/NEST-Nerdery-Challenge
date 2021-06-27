import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShoppingStatus } from './dto/shopping-status.dto';
import { ShoppingCardService } from './shopping-card.service';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('buy')
export class ShoppingCardController {
  constructor(private readonly shoppingService: ShoppingCardService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getShoppingProducts(@Request() req) {
    return this.shoppingService.getPaidProductsForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  buyProducts(@Request() req, @Body() status: ShoppingStatus) {
    return this.shoppingService.createPurchase(req.user.id, status);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/history')
  getHistoryShopping() {
    return this.shoppingService.getHistoryShopping();
  }
}
