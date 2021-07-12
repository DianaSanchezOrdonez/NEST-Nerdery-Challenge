import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ActiveBookDto } from '../books/dto/activeBooks.dto';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../common/services/prisma.service';
import { SearchCategory } from './dto/search-category.dto';

@Injectable()
export class SearchBookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async searchingByCategory(
    nameCategory: SearchCategory,
  ): Promise<ActiveBookDto[]> {
    const { search } = nameCategory;
    const category = await this.categoryService.getCategoryByName(
      search.toLowerCase(),
    );

    const books = await this.prismaService.book.findMany({
      where: {
        categoryId: category.id,
      },
    });

    if (books.length === 0) {
      throw new NotFoundException(
        `This ${search} category does not have books`,
      );
    }
    return plainToClass(ActiveBookDto, books);
  }
}
