import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multer-options';
import { ExtendedRequest } from '../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiFile } from '../../common/swagger/file/api-file';

@Controller('stories')
@ApiTags('stories')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApiFile })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Req() req: ExtendedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.storiesService.create(req.user.sub, file);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll(@Req() req: ExtendedRequest) {
    return this.storiesService.findAll(req.user.sub);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ApiFile })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Req() req: ExtendedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.storiesService.update(req.user.sub, file, id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest, @Param('id') id: string) {
    return this.storiesService.remove(req.user.sub, id);
  }
}
