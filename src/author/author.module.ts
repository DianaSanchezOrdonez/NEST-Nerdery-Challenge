import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [CommonModule],
  providers: [AuthorService],
  exports: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
