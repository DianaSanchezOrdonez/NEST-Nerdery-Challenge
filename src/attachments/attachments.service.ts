/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { config as configAWS, S3 } from 'aws-sdk';
import { PrismaService } from '../common/services/prisma.service';
import { nanoid } from 'nanoid';
import { plainToClass } from 'class-transformer';
import { AttachmentDto } from './dto/attachment.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class AttachmentsService {
  private readonly s3: S3;
  constructor(private readonly prismaService: PrismaService) {
    configAWS.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    this.s3 = new S3();
  }

  async createSignedUrl(input, bookId) {
    const ext = input.split('/')[1];

    //Create attachment in table
    const attachment = await this.prismaService.attachment.create({
      data: {
        bookId,
        contentType: input,
        key: nanoid(),
        ext,
      },
    });

    //AWS: Pre-signing a 'putObject' (asynchronously)
    const signedUrl = this.s3.getSignedUrl('putObject', {
      Key: `${attachment.key}.${attachment.ext}`,
      ContentType: attachment.contentType,
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Expires: Number(process.env.AWS_EXPIRATION_TIME),
    });
    //console.log('signedUrl', `${attachment.key}.${attachment.ext}`)
    return { signedUrl, ...attachment };
  }

  // key → attachment.key
  getSignedURL(key, ext): string {
    console.log('signedUrl', `${key}.${ext}`)
    return this.s3.getSignedUrl('getObject', {
      Key: `${key}.${ext}`,
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Expires: Number(process.env.AWS_EXPIRATION_TIME),
    });
  }
}
