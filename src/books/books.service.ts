import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { Author, Book, Category } from '@prisma/client';
import { CreateBookDto } from './dto/createBook.dto';
import { BookStateDto } from './dto/bookState.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { paginatedHelper } from '../common/helpers/paginated.helper';
import { plainToClass } from 'class-transformer';
import { ActiveBookDto } from './dto/activeBooks.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { ResponseBookDto } from './dto/response-book.dto';
import { AttachmentsService } from '../attachments/attachments.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.prismaService.book.findFirst({
      where: {
        title: createBookDto.title,
      },
    });
    console.log(existingBook);
    if (existingBook)
      throw new BadRequestException(
        `The ${createBookDto.title} book has already exist`,
      );

    const category = await this.preloadCategoryByName(
      createBookDto.categoryName,
    );
    const author = await this.preloadAuthorByName(createBookDto.authorName);
    const bookCreated = await this.prismaService.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        yearPublished: createBookDto.yearPublished,
        quantity: createBookDto.quantity,
        price: createBookDto.price,
        urlImage: createBookDto.urlImage,
        authorId: author.id,
        categoryId: category.id,
      },
    });
    return bookCreated;
  }

  async getBooks(paginationQuery: PaginationQueryDto): Promise<Book[]> {
    const { page, perPage } = paginationQuery;
    const paginationParams = paginatedHelper({ page, perPage });
    const allBooks = await this.prismaService.book.findMany({
      ...paginationParams,
    });
    return allBooks;
  }

  async getActiveBooks(
    paginationQuery: PaginationQueryDto,
  ): Promise<ActiveBookDto[]> {
    const { page, perPage } = paginationQuery;
    const paginationParams = paginatedHelper({ page, perPage });
    const activeBooks = await this.prismaService.book.findMany({
      where: {
        active: true,
      },
      ...paginationParams,
    });

    return plainToClass(ActiveBookDto, activeBooks);
  }

  async getOneBook(bookId): Promise<Book> {
    const oneBook = await this.prismaService.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!oneBook)
      throw new NotFoundException(
        `There's not any book with this Id: ${bookId}`,
      );

    return oneBook;
  }

  async getOneBookActive(bookId: number): Promise<ResponseBookDto> {
    const book = await this.prismaService.book.findFirst({
      where: {
        AND: [{ id: bookId }, { active: true }],
      },
    });

    if (!book)
      throw new NotFoundException(
        `There's not an book with this Id: ${bookId}`,
      );
    return plainToClass(ResponseBookDto, book);
  }

  async getBooksActive(): Promise<Book[]> {
    return await this.prismaService.book.findMany({
      where: { active: true },
    });
  }

  async updateBook(bookId: number, updateBookDto) {
    const { categoryName, authorName, ...rest } = updateBookDto;
    const bookToUpdate = await this.getOneBook(bookId);

    let category;
    if (!categoryName) {
      category = bookToUpdate.categoryId;
    } else {
      category = await this.preloadCategoryByName(categoryName);
    }

    let author;
    if (!authorName) {
      author = bookToUpdate.authorId;
    } else {
      author = await this.preloadAuthorByName(authorName);
    }

    const bookUpdated = await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        ...rest,
        authorId: author.id,
        categoryId: category.id,
      },
    });
    return bookUpdated;
  }

  async deleteBook(bookId: number) {
    await this.getOneBook(bookId);
    const bookToDelete = await this.prismaService.book.delete({
      where: { id: bookId },
      select: {
        title: true,
      },
    });
    return bookToDelete;
  }

  async disableBook(bookId: number, state: BookStateDto) {
    await this.getOneBook(bookId);
    const bookUpdated = await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        active: state.active,
      },
      select: {
        title: true,
        active: true,
      },
    });
    if (!bookUpdated)
      throw new NotFoundException(
        `There's not any book with this Id: ${bookId}`,
      );
    return bookUpdated;
  }

  private async preloadAuthorByName(name: string): Promise<Author> {
    const existingAuthor = await this.prismaService.author.findUnique({
      where: { fullName: name },
      include: {
        books: true,
      },
    });
    console.log('existing', existingAuthor);
    if (existingAuthor) {
      return existingAuthor;
    }
    return await this.prismaService.author.create({ data: { fullName: name } });
  }

  private async preloadCategoryByName(nameCategory: string): Promise<Category> {
    const existingCategory = await this.prismaService.category.findUnique({
      where: { name: nameCategory },
      include: {
        books: true,
      },
    });
    if (existingCategory) {
      return existingCategory;
    }
    return await this.prismaService.category.create({
      data: { name: nameCategory },
    });
  }

  async updateStockInBook(bookId: number, count: number, quantity: number) {
    return await this.prismaService.book.update({
      where: { id: bookId },
      data: { quantity: quantity - count },
    });
  }

  async addUrlImage(
    bookId: number,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<Book> {
    const urlImage = await this.attachmentsService.createAttachment(
      imageBuffer,
      filename,
    );
    return await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        urlImage: urlImage.url,
        imageId: urlImage.id,
      },
    });
  }
}
