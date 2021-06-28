import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArrayCardItemsDto } from './dto/array-card-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemCardDto } from './dto/item-card.dto';
import { ItemService } from './item.service';

@ApiTags('Cart_Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post()
  createItemCard(
    @Request() req,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemCardDto> {
    return this.itemService.createCardItem(req.user.id, createItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Get()
  getCardItem(@Request() req): Promise<ArrayCardItemsDto[]> {
    return this.itemService.getCardItemFromUser(req.user.id);
  }
}
