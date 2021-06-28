import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/services/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { CommonModule } from './common/common.module';
import { AuthorService } from './author/author.service';
import { AuthorController } from './author/author.controller';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { BooksModule } from './books/books.module';
import { BooksService } from './books/books.service';
import { CategoryController } from './category/category.controller';
import { BooksController } from './books/books.controller';
import { CategoryService } from './category/category.service';
import { ItemService } from './item/item.service';
import { ItemModule } from './item/item.module';
import { ItemController } from './item/item.controller';
import { ShoppingCardService } from './shopping-card/shopping-card.service';
import { ShoppingCardController } from './shopping-card/shopping-card.controller';
import { ShoppingCardModule } from './shopping-card/shopping-card.module';
import { AttachmentsService } from './attachments/attachments.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { AttachmentsController } from './attachments/attachments.controller';
import { SearchBookService } from './search-book/search-book.service';
import { SearchBookController } from './search-book/search-book.controller';
import { SearchBookModule } from './search-book/search-book.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CommonModule,
    AuthorModule,
    CategoryModule,
    BooksModule,
    ItemModule,
    ShoppingCardModule,
    AttachmentsModule,
    SearchBookModule,
  ],
  controllers: [
    AppController,
    AuthorController,
    CategoryController,
    BooksController,
    ItemController,
    ShoppingCardController,
    AttachmentsController,
    SearchBookController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    AuthorService,
    BooksService,
    CategoryService,
    ItemService,
    ShoppingCardService,
    AttachmentsService,
    SearchBookService,
  ],
})
export class AppModule {}
