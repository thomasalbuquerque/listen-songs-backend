import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';

@Controller('songs')
@ApiTags('songs')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll() {
    return this.songsService.findAll();
  }

  @Get(':songIdSpotify')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findOne(@Param('songIdSpotify') songIdSpotify: string) {
    return this.songsService.findOne(songIdSpotify);
  }

  @Patch(':songIdSpotify')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Param('songIdSpotify') songIdSpotify: string,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.update(songIdSpotify, updateSongDto);
  }

  @HttpCode(204)
  @Delete(':songIdSpotify')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Param('songIdSpotify') songIdSpotify: string) {
    return this.songsService.remove(songIdSpotify);
  }
}
