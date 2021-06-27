import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { BooksService } from './books.service';
import { ResponseBookDto } from './dto/response-book.dto';
import { UpdateBookDto } from './dto/updatebook.dto';

@Controller('book')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createBook(@Body() createBook): Promise<Book> {
    console.log(createBook);
    return this.bookService.createBook(createBook);
  }

  @Get()
  getBooks(): Promise<Book[]> {
    return this.bookService.getBooks();
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  updateBook(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/disable/:id')
  disable(@Param('id') id: number, @Body() bookStateDto) {
    return this.bookService.disableBook(id, bookStateDto);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }

  @Get('/:id')
  getBook(@Param('id') id: number): Promise<ResponseBookDto> {
    return this.bookService.getActiveBook(id);
  }
}
