import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShoppingStatus } from './dto/shopping-status.dto';
import { ShoppingCardService } from './shopping-card.service';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ShoppingCard } from '@prisma/client';

@ApiTags('Shopping_Cart')
@Controller('buy')
export class ShoppingCardController {
  constructor(private readonly shoppingService: ShoppingCardService) {}

  // Get history of orders
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Get('/history')
  createBook(): Promise<ShoppingCard[]> {
    return this.shoppingService.getAllPurchase();
  }

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
