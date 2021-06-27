import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Author, Book, Category } from '@prisma/client';
import { CreateBookDto } from './dto/createBook.dto';
import { BookStateDto } from './dto/bookState.dto';
import { ResponseBookDto } from './dto/response-book.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const category = await this.preloadCategoryByName(
      createBookDto.categoryName,
    );
    const author = await this.preloadAuthorByName(createBookDto.authorName);
    console.log('createBook', createBookDto);
    const bookCreated = await this.prismaService.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        yearPublished: createBookDto.yearPublished,
        price: createBookDto.price,
        urlImage: createBookDto.urlImage,
        authorId: author.id,
        categoryId: category.id,
      },
    });
    return bookCreated;
  }

  async getBooks(): Promise<Book[]> {
    return await this.prismaService.book.findMany();
  }

  async updateBook(bookId: number, updateBookDto) {
    let category;
    if (updateBookDto.categoryName) {
      category = await this.preloadCategoryByName(updateBookDto.categoryName);
      console.log(category);
    }

    let author;
    if (updateBookDto.authorName) {
      author = await this.preloadAuthorByName(updateBookDto.authorName);
    }
    const bookUpdated = await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        title: updateBookDto.title,
        description: updateBookDto.description,
        yearPublished: updateBookDto.yearPublished,
        price: updateBookDto.price,
        urlImage: updateBookDto.urlImage,
        authorId: author.id,
        categoryId: category.id,
      },
    });
    return bookUpdated;
  }

  async deleteBook(bookId: number) {
    const bookToDelete = await this.prismaService.book.delete({
      where: { id: bookId },
      select: {
        title: true,
      },
    });
    console.log(bookToDelete);
    return bookToDelete;
  }

  async disableBook(bookId: number, state: BookStateDto) {
    console.log(state, bookId);
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
    console.log(bookId, state);
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
    console.log('existing', existingCategory);
    if (existingCategory) {
      return existingCategory;
    }
    return await this.prismaService.category.create({
      data: { name: nameCategory },
    });
  }

  async getActiveBook(bookId: number): Promise<ResponseBookDto> {
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

  async updateStockInBook(bookId: number, count: number, quantity: number) {
    return await this.prismaService.book.update({
      where: { id: bookId },
      data: { quantity: quantity - count },
    });
  }
}
