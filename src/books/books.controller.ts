import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updatebook.dto';
import { Express } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('book')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Post()
  createBook(@Body() createBook: CreateBookDto): Promise<Book> {
    console.log(createBook);
    return this.bookService.createBook(createBook);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getActiveBooks(@Query() paginationQuery) {
    return this.bookService.getActiveBooks(paginationQuery);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/active')
  getBooksActive(): Promise<Book[]> {
    return this.bookService.getBooksActive();
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Get('/manager')
  getAllBooks(@Query() paginationQuery): Promise<Book[]> {
    return this.bookService.getBooks(paginationQuery);
  }

  @Get('/:idBook')
  getOneBook(@Param('idBook') id: number) {
    return this.bookService.getOneBook(id);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Patch('/update/:id')
  updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Patch('/disable/:id')
  disable(@Param('id') id: number, @Body() bookStateDto) {
    return this.bookService.disableBook(id, bookStateDto);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Post(':id/attachment')
  addUrlImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Book>{
    return this.bookService.addUrlImage(id, file.buffer, file.originalname);
  }
}
