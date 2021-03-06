import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { paginatedHelper } from '../common/helpers/paginated.helper';
import { PrismaService } from '../common/services/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAuthors(paginationQuery: PaginationQueryDto): Promise<Author[]> {
    const { page, perPage } = paginationQuery;
    const paginationParams = paginatedHelper({ page, perPage });
    return await this.prismaService.author.findMany({
      ...paginationParams,
    });
  }

  async getAuthor(idAuthor: string): Promise<Author> {
    if (!Number(idAuthor)) {
      throw new BadRequestException(`${idAuthor} must be a number`);
    }
    const author = await this.prismaService.author.findUnique({
      where: { id: Number(idAuthor) },
    });
    if (!author)
      throw new NotFoundException(
        `There's not an author with this Id: ${idAuthor}`,
      );
    return author;
  }

  async createAuthor(createAuthor: CreateAuthorDto): Promise<Author> {
    return await this.prismaService.author.upsert({
      where: { fullName: createAuthor.fullName },
      create: {
        fullName: createAuthor.fullName,
      },
      update: {},
    });
  }
}
