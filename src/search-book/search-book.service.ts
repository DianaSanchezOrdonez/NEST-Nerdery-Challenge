import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ActiveBookDto } from '../books/dto/activeBooks.dto';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class SearchBookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async searchingByCategory(nameCategory): Promise<ActiveBookDto[]> {
    const { search } = nameCategory;
    const category = await this.categoryService.getCategoryByName(
      search.toLowerCase(),
    );
    const books = await this.prismaService.book.findMany({
      where: {
        categoryId: category.id,
      },
    });
    return plainToClass(ActiveBookDto, books);
  }
}
