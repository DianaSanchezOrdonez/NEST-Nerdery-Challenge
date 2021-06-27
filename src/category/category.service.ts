import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from '../books/dto/category.dto';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategories(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

  async getCategory(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      throw new NotFoundException('There is not a category with this id');
    }
    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name },
    });
    if (category) {
      throw new NotFoundException('The category has already exist');
    }
    return await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }
}
