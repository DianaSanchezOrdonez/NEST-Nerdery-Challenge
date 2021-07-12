import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [CommonModule],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
  controllers: [AttachmentsController],
})
export class AttachmentsModule {}
