import { Exclude, Expose } from 'class-transformer';
import { ContentTypeEnum, FileExtensionEnum } from '../enums/attachement.enum';

export class AttachmentDto {
  @Exclude()
  readonly id: number;

  @Expose()
  readonly key: string;

  @Expose()
  readonly ext: FileExtensionEnum;

  @Expose()
  readonly contentType: ContentTypeEnum;

  @Expose()
  readonly signedUrl?: string;

  @Expose()
  readonly createdAt: Date;
}
