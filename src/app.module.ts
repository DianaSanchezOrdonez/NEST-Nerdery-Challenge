import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { BooksModule } from './books/books.module';
import { ItemModule } from './item/item.module';
import { ShoppingCardModule } from './shopping-card/shopping-card.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { SearchBookModule } from './search-book/search-book.module';
import { GraphQLModule } from '@nestjs/graphql';
// import {ConfigService} from '@nest/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      debug: false,
    }),
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
  controllers: [],
  providers: [],
})
export class AppModule {}
