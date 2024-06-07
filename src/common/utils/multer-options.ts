import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import { ExtendedRequest } from '../types/request.type';
import { Request } from 'express';

export const multerOptions = {
  storage: multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
      const uploadsDir = path.resolve(__dirname, '../../../uploads');
      cb(null, uploadsDir);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const now = new Date();
      const dateString = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, '0')}-${now.getUTCDate().toString().padStart(2, '0')}_${now.getUTCHours().toString().padStart(2, '0')}h-${now.getUTCMinutes().toString().padStart(2, '0')}m-${now.getUTCSeconds().toString().padStart(2, '0')}s-${now.getUTCMilliseconds().toString().padStart(3, '0')}ms`;
      //Example of result: 2022-03-15_14h-58m-10s-402ms
      cb(null, `${dateString}_${file.originalname}`);
    },
  }),
  fileFilter: (
    req: ExtendedRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.match(/jp.*|png|webp/)) {
      return cb(
        new BadRequestException(
          `File type .${file.originalname.split('.').pop()} is not allowed`,
        ),
        false,
      );
    }
    cb(null, true);
  },
};
