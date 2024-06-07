import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadOneImageToS3(
    s3prefix: string,
    identification: string,
    file: Express.Multer.File,
  ) {
    const now = new Date();
    const dateString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, '0')}-${now.getUTCDate().toString().padStart(2, '0')}_${now.getUTCHours().toString().padStart(2, '0')}h-${now.getUTCMinutes().toString().padStart(2, '0')}m-${now.getUTCSeconds().toString().padStart(2, '0')}s-${now.getUTCMilliseconds().toString().padStart(3, '0')}ms`;
    //Example of result: 2022-03-15_14h-58m-10s-402ms

    const webpPath = `${file.path}/${file.filename}.webp`;
    await sharp(file.path).webp().toFile(webpPath);
    const fileStream = fs.createReadStream(webpPath);
    const bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    const key = `${s3prefix}/${identification}/${dateString}.webp`;
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: 'image/webp',
    };
    const s3 = new S3({
      region: this.configService.getOrThrow('AWS_REGION'),
    });
    await s3.send(new PutObjectCommand(uploadParams));

    const s3imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
    fs.unlink(webpPath, (err) => {
      if (err) {
        console.error(`Failed to delete local webp file. Error: ${err}`);
      }
    });
    return s3imageUrl;
  }

  async deleteOneImageFromS3(s3imageUrl: string) {
    const bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
    const key = s3imageUrl.replace(
      `https://${bucketName}.s3.amazonaws.com/`,
      '',
    );
    const s3 = new S3({
      region: this.configService.getOrThrow('AWS_REGION'),
    });
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
  }
}
