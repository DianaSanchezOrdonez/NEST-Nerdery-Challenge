import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from '../common/services/prisma.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
