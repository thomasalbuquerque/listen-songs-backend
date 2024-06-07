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
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';

@Controller('playlists')
@ApiTags('playlists')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.create(createPlaylistDto);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll() {
    return this.playlistsService.findAll();
  }

  @Get(':playlistIdSpotify')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findOne(@Param('playlistIdSpotify') playlistIdSpotify: string) {
    return this.playlistsService.findOne(playlistIdSpotify);
  }

  @Patch(':playlistIdSpotify')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Param('playlistIdSpotify') playlistIdSpotify: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(playlistIdSpotify, updatePlaylistDto);
  }

  @HttpCode(204)
  @Delete(':playlistIdSpotify')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Param('playlistIdSpotify') playlistIdSpotify: string) {
    return this.playlistsService.remove(playlistIdSpotify);
  }
}
