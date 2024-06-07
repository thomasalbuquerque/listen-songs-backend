import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../../common/prisma/prisma.service';
import { S3Service } from '../../common/aws/s3.service';
import { StoryEntity } from './entities/story.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class StoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3service: S3Service,
    private readonly i18nService: I18nService,
  ) {}
  async create(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        this.i18nService.t('file.no_file_uploaded'),
      );
    }

    this.deleteOldFilesKeep5minutes();

    const now = new Date();
    const startOfUTCDay = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    const today3am = new Date(startOfUTCDay + 3 * 60 * 60 * 1000);
    const storiesCount = await this.prismaService.story.count({
      where: {
        userId: userId,
        createdAt: {
          gte: today3am,
        },
      },
    });
    if (storiesCount >= 10) {
      this.deleteUploadedFile(file.path);
      throw new BadRequestException(
        this.i18nService.t('stories.maximum_10_per_day'),
      );
    }

    if (file.size > 10000000) {
      await this.prismaService.story.create({
        data: {
          imageUrl: '',
          valid: false,
          expiresAt: new Date(),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      this.deleteUploadedFile(file.path);
      throw new BadRequestException(
        this.i18nService.t('file.maximum_size_10mb'),
      );
    }

    const imageUrl = await this.s3service.uploadOneImageToS3(
      'stories',
      userId,
      file,
    );
    const story = await this.prismaService.story.create({
      data: {
        imageUrl,
        valid: true,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    this.deleteUploadedFile(file.path);

    const storyEntity = new StoryEntity(story);
    return storyEntity;
  }

  private deleteOldFilesKeep5minutes() {
    const uploadsDir = path.resolve(__dirname, '../../../uploads');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    fs.readdir(uploadsDir, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const fileUploadedDate = file.split('_')[0] + '_' + file.split('_')[1];
        const fileUploadedDateFormat = fileUploadedDate
          .replace('_', 'T')
          .replace('h-', ':')
          .replace('m-', ':')
          .replace('s-', '.')
          .replace('ms', 'Z');
        const fileUploadedDateFormatTimestamp = new Date(
          fileUploadedDateFormat,
        );
        if (fileUploadedDateFormatTimestamp < fiveMinutesAgo) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete local file. Error: ${err}`);
            }
            console.log(`Deleted file: ${filePath}`);
          });
        }
      }
    });
  }

  private deleteUploadedFile(filePath: string) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete local file. Error: ${err}`);
      }
    });
  }

  async findAll(userId: string) {
    const following = await this.prismaService.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });
    const myIdAndMyFollowingIds = [
      userId,
      ...following.map((user) => user.followingId),
    ];
    const stories = await this.prismaService.story.findMany({
      where: {
        user: {
          id: {
            in: myIdAndMyFollowingIds,
          },
        },
        valid: true,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    //put my stories first
    stories.sort((a, b) => {
      if (a.userId === userId) {
        return -1;
      }
      if (b.userId === userId) {
        return 1;
      }
      return 0;
    });
    const storiesEntities = stories.map((story) => new StoryEntity(story));
    return storiesEntities;
  }

  async update(userId: string, file: Express.Multer.File, id: string) {
    if (!file) {
      throw new BadRequestException(
        this.i18nService.t('file.no_file_uploaded'),
      );
    }

    const story = await this.prismaService.story.findUnique({
      where: {
        id,
      },
    });
    if (!story) {
      this.deleteUploadedFile(file.path);
      throw new BadRequestException(this.i18nService.t('stories.not_found'));
    }

    if (story.userId !== userId) {
      this.deleteUploadedFile(file.path);
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }

    if (file.size > 10000000) {
      this.deleteUploadedFile(file.path);
      throw new BadRequestException(
        this.i18nService.t('file.maximum_size_10mb'),
      );
    }

    await this.s3service.deleteOneImageFromS3(story.imageUrl);

    const imageUrl = await this.s3service.uploadOneImageToS3(
      'stories',
      userId,
      file,
    );
    const updatedStory = await this.prismaService.story.update({
      where: {
        id,
      },
      data: {
        imageUrl,
      },
    });
    this.deleteUploadedFile(file.path);

    const storyEntity = new StoryEntity(updatedStory);
    return storyEntity;
  }

  async remove(userId: string, id: string) {
    const story = await this.prismaService.story.findUnique({
      where: {
        id,
      },
    });

    if (!story) {
      throw new BadRequestException(this.i18nService.t('stories.not_found'));
    }

    if (story.userId !== userId) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }

    await this.s3service.deleteOneImageFromS3(story.imageUrl);

    await this.prismaService.story.delete({
      where: {
        id,
      },
    });
  }
}
