import { Injectable } from '@nestjs/common';
import { config as configAWS, S3 } from 'aws-sdk';
import { PrismaService } from '../common/services/prisma.service';
import { v4 as uuid } from 'uuid';
import { Attachment } from '@prisma/client';

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

  async createAttachment(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<Attachment> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    return await this.prismaService.attachment.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    });
  }
}
