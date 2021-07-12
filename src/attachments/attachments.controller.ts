import { Controller } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  // @Roles(Role.MANAGER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiOperation({ summary: 'Only MANAGER access' })
  // @ApiBearerAuth('access_token')
  // @Post(':bookId')
  // @ApiConsumes('multipart/form-data')
  // @ApiFile('file')
  // async createImage(@Request() req, @Param('bookId') bookId: number) {
  //   return await this.attachmentsService.endpointToUpload(
  //     req.headers['content-type'], bookId
  //   );
  // }
}
