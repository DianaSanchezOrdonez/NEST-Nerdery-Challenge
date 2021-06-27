import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArrayCardItemsDto } from './dto/array-card-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemCardDto } from './dto/item-card.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createItemCard(
    @Request() req,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemCardDto> {
    return this.itemService.createCardItem(req.user.id, createItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCardItem(@Request() req): Promise<ArrayCardItemsDto[]> {
    return this.itemService.getCardItemFromUser(req.user.id);
  }
}
