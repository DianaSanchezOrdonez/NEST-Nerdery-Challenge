import { Module } from '@nestjs/common';
import { AttachmentsService } from '../attachments/attachments.service';
import { UsersService } from '../users/users.service';
import { BooksService } from '../books/books.service';
import { CommonModule } from '../common/common.module';
import { ItemService } from './item.service';

@Module({
  imports: [CommonModule],
  providers: [ItemService, UsersService, BooksService, AttachmentsService]
})
export class ItemModule {}
