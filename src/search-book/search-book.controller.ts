import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActiveBookDto } from '../books/dto/activeBooks.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchBookService } from './search-book.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchCategory } from './dto/search-category.dto';

@ApiTags('Search_by_Category')
@Controller('search-book')
export class SearchBookController {
  constructor(private readonly searchBookService: SearchBookService) {}

  @Get()
  searchByCategory(@Query() search: SearchCategory): Promise<ActiveBookDto[]> {
    return this.searchBookService.searchingByCategory(search);
  }
}
