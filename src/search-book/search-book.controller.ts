import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActiveBookDto } from '../books/dto/activeBooks.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchBookService } from './search-book.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Search_by_Category')
@Controller('search-book')
export class SearchBookController {
  constructor(private readonly searchBookService: SearchBookService) {}

  @Get()
  searchByCategory(@Query() search): Promise<ActiveBookDto[]> {
    return this.searchBookService.searchingByCategory(search);
  }
}
