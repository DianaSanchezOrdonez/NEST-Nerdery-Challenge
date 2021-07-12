/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Author, Book, Category } from '@prisma/client';
import { CreateBookDto } from './dto/createBook.dto';
import { BookStateDto } from './dto/bookState.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginatedHelper } from '../common/helpers/paginated.helper';
import { plainToClass } from 'class-transformer';
import { ActiveBookDto } from './dto/activeBooks.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { DetailBookDto } from './dto/detailBook.dto';
import { ResponseBookDto } from './dto/response-book.dto';
import { LikeBookDto } from './dto/likeBookDto.dto';
import { AttachmentsService } from '../attachments/attachments.service';
import { String } from 'aws-sdk/clients/cloudtrail';
import { AttachmentDto } from 'src/attachments/dto/attachment.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.prismaService.book.findFirst({
      where: {
        title: createBookDto.title.toLowerCase(),
      },
    });
    if (existingBook)
      throw new BadRequestException(
        `The book ${createBookDto.title} has already exist`,
      );

    const category = await this.preloadCategoryByName(
      createBookDto.categoryName,
    );
    const author = await this.preloadAuthorByName(createBookDto.authorName);
    const bookCreated = await this.prismaService.book.create({
      data: {
        title: createBookDto.title.toLowerCase(),
        description: createBookDto.description,
        yearPublished: createBookDto.yearPublished,
        quantity: createBookDto.quantity,
        price: createBookDto.price,
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
  ): Promise<Book[]> {
    const { page, perPage } = paginationQuery;
    const paginationParams = paginatedHelper({ page, perPage });
    const activeBooks = await this.prismaService.book.findMany({
      where: {
        active: true,
      },
      ...paginationParams,
    });

    return activeBooks;
  }

  // For all books AAdd validation 
  async findOne(bookId: number): Promise<DetailBookDto> {
    return await this.prismaService.book.findUnique({
      where: {
        id: bookId,
      },
    });
  }

  async getOneBookActive(bookId: number): Promise<ResponseBookDto> {
    const book = await this.prismaService.book.findFirst({
      where: {
        AND: [{ id: bookId }, { active: true }],
      },
    });
    if (!book) {
      throw new NotFoundException(
        `There's not an book with this Id: ${bookId}`,
      );
    }

    return plainToClass(ResponseBookDto, book);
  }

  async updateBook(bookId: number, updateBookDto): Promise<Book> {
    const { categoryName, authorName, ...rest } = updateBookDto;
    const bookToUpdate = await this.findOne(bookId);
    if (!bookToUpdate) {
      throw new NotFoundException(
        `There's not an book with this Id: ${bookId}`,
      );
    }
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
    const bookToDelete = await this.findOne(bookId);
    if (!bookToDelete) {
      throw new NotFoundException(
        `There's not an book with this Id: ${bookId}`,
      );
    }
    const bookdeleted = await this.prismaService.book.delete({
      where: { id: bookId },
      select: {
        title: true,
      },
    });
    return bookdeleted;
  }

  async disableBook(bookId: number, state: BookStateDto) {
    const bookToDisable = await this.findOne(bookId);
    if (!bookToDisable) {
      throw new NotFoundException(
        `There's not an book with this Id: ${bookId}`,
      );
    }
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

  async processLikes(bookId: number, uid: number, dataLike: LikeBookDto) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book)
      throw new NotFoundException(
        `There's not any book with this Id: ${bookId}`,
      );
    let totalLikes;
    if (dataLike.like) {
      totalLikes = await this.likeBook(bookId, uid, book.likesQuantity);
    } else {
      totalLikes = await this.dislikeBook(bookId, uid, book.likesQuantity);
    }
    return totalLikes;
  }

  async likeBook(bookId, uid, quantityLikes) {
    const bookLike = await this.prismaService.booksLikes.findFirst({
      where: {
        bookId: bookId,
        userId: uid,
      },
    });
    if (bookLike !== null) {
      throw new NotFoundException('Cant like a post that has a like');
    }

    const updateLikes = await this.prismaService.book.update({
      where: {
        id: bookId,
      },
      data: {
        likesQuantity: quantityLikes + 1,
      },
    });

    await this.prismaService.booksLikes.create({
      data: {
        bookId,
        userId: uid,
        like: true,
      },
    });

    return updateLikes.likesQuantity;
  }

  async dislikeBook(bookId, uid, quantityLikes) {
    const bookLike = await this.prismaService.booksLikes.findFirst({
      where: {
        bookId: bookId,
        userId: uid,
      },
    });

    if (bookLike == null) {
      throw new NotFoundException('Cant dislike a post that havent been liked');
    }

    const updateLikes = await this.prismaService.book.update({
      where: {
        id: bookId,
      },
      data: {
        likesQuantity: quantityLikes - 1,
      },
    });

    await this.prismaService.booksLikes.delete({
      where: {
        id: bookLike?.id,
      },
    });
    console.log(updateLikes.likesQuantity);
    return updateLikes.likesQuantity;
  }

  private async preloadAuthorByName(name: string): Promise<Author> {
    const existingAuthor = await this.prismaService.author.findUnique({
      where: { fullName: name },
      include: {
        books: true,
      },
    });
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

  async endpointToUpload(input, bookId): Promise<AttachmentDto> {
    const book = this.findOne(bookId);
    if (!book) throw new BadRequestException(`This ${bookId} doesn't exist`);

    const allowContentType = ['image/png', 'image/jpg', 'image/jpeg'];
    const hasContentType = allowContentType.find((type) =>
      input.includes(type),
    );
    if (!hasContentType) throw new BadRequestException('Invalid extension');

    const signedUrlAttach = await this.attachmentsService.createSignedUrl(
      input,
      bookId,
    );

    return plainToClass(AttachmentDto, signedUrlAttach);
  }

  async getUrlImages(bookId: number): Promise<string> {
    const attachemt = await this.prismaService.attachment.findFirst({
      where: { bookId },
    });
    //console.log('attachemt', attachemt)
    return this.attachmentsService.getSignedURL(attachemt.key, attachemt.ext);
    // const urlStored = attachemts.map((attachemt) =>
    //   this.attachmentsService.getSignedURL(attachemt.key, attachemt.ext)
    // )
  }

  async uploadUrlImage(bookId: number) : Promise<Book> {
    const book = await this.findOne(bookId);
    if (!book) throw new BadRequestException(`This ${bookId} doesn't exist`);
    
    const urlImage = await this.getUrlImages(bookId)
    return await this.updateBook(bookId, { urlImage })
  }
}
