import { Controller, Post, Body, Delete, Req } from '@nestjs/common';
import { SpotifyDataService } from './spotify-data.service';
import { CreateSpotifyDataDto } from './dto/create-spotify-data.dto';
import { ExtendedRequest } from '../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ReturnMessageDto } from '../../common/dtos/return-message.dto';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';

@Controller('spotify-data')
@ApiTags('spotify-data')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class SpotifyDataController {
  constructor(private readonly spotifyService: SpotifyDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create Spotify data' })
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Req() req: ExtendedRequest,
    @Body() createSpotifyDto: CreateSpotifyDataDto,
  ): Promise<ReturnMessageDto> {
    return this.spotifyService.create(req.user.sub, createSpotifyDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove Spotify data' })
  @ApiResponse({ status: 200, type: ReturnMessageDto })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest): Promise<ReturnMessageDto> {
    return this.spotifyService.remove(req.user.sub);
  }
}
