import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { HeardSongsService } from './heard-songs.service';
import { HeardSongQueryDto } from './dto/heard-song.query.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';

@Controller('heard-songs')
@ApiTags('heard-songs')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class HeardSongsController {
  constructor(private readonly heardSongsService: HeardSongsService) {}

  @Get()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll(@Query(ValidationPipe) heardSongQueryDto: HeardSongQueryDto) {
    return this.heardSongsService.findAll(
      heardSongQueryDto.limit,
      heardSongQueryDto.offset,
    );
  }
}
