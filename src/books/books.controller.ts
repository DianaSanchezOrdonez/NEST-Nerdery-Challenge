/* eslint-disable prettier/prettier */
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
  Request,
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
import { DetailBookDto } from './dto/detailBook.dto';
import { LikeBookDto } from './dto/likeBookDto.dto';
import { UpdateBookDto } from './dto/updatebook.dto';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFile } from '../common/helpers/upload-swagger-decorator';

@ApiTags('Books')
@Controller('book')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  // Create a book manager
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Post()
  createBook(@Body() createBook: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBook);
  }

  // See actives products costumer
  @Get()
  getActiveBooks(@Query() paginationQuery) {
    return this.bookService.getActiveBooks(paginationQuery);
  }

  // See all products manager
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Get('/manager')
  getAllBooks(@Query() paginationQuery): Promise<Book[]> {
    return this.bookService.getBooks(paginationQuery);
  }

  // See active book details costumer
  @Get('/:idBook')
  getOneBook(@Param('idBook') id: number): Promise<DetailBookDto> {
    return this.bookService.getOneBookActive(id);
  }

  // Likes to books by costumer
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Patch('/:id')
  updateLikes(
    @Param('id') bookId: number,
    @Request() req,
    @Body() dataLike: LikeBookDto,
  ): Promise<any> {
    // console.log(bookId, req.user.id, dataLike);
    return this.bookService.processLikes(bookId, req.user.id, dataLike);
  }

  //Update books manager
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

  // Disable books manager
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  @Patch('/disable/:id')
  disable(@Param('id') id: number, @Body() bookStateDto) {
    return this.bookService.disableBook(id, bookStateDto);
  }

  // Delete books manager
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }

  //Get upload images endpoint
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/:id/image')
  @ApiOperation({ summary: 'Only MANAGER access' })
  @ApiBearerAuth('access_token')
  //@ApiConsumes('image/png')
  //@ApiHeader({ name: 'content-type' })
  endpointToUpload(@Request() req, @Param('id') id: number) {
    return this.bookService.endpointToUpload(req.headers['content-type'], id);
  }

  @Patch('/:id/image')
  uploadUrlImage(@Param('id') id: number) {
    return this.bookService.uploadUrlImage(id);
  }

  // @Get('/:id/image')
  // getUrl(@Param('id') id: number){
  //   return this.bookService.getUrlImages(id)
  // }
}
