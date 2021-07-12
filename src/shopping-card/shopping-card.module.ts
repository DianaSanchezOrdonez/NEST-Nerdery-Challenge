import { Module } from '@nestjs/common';
import { ItemService } from '../item/item.service';
import { CommonModule } from '../common/common.module';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { AttachmentsService } from '../attachments/attachments.service';

@Module({
  imports: [CommonModule],
  providers: [ItemService, BooksService, UsersService, AttachmentsService]
})
export class ShoppingCardModule {}
