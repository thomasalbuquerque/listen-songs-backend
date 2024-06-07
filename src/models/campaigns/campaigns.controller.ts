import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AllowedSongsDto } from './dto/allowed-songs.dto';
import { Status } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiForbiddenError } from '../../common/swagger/errors/api-forbidden.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';

@Controller('campaigns')
@ApiTags('campaigns')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Patch(':id/allowed-songs')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  updateAllowedSongs(
    @Param('id') id: string,
    @Body() updateAllowedSongsDto: AllowedSongsDto,
  ) {
    return this.campaignsService.updateAllowedSongs(id, updateAllowedSongsDto);
  }

  @Delete(':id/allowed-songs')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  deleteAllowedSongs(
    @Param('id') id: string,
    @Body() deleteAllowedSongsDto: AllowedSongsDto,
  ) {
    return this.campaignsService.deleteAllowedSongs(id, deleteAllowedSongsDto);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiQuery({ name: 'status', enum: Status, isArray: true, required: false })
  findAll(@Query('status') status: Status[]) {
    if (typeof status === 'string') {
      return this.campaignsService.findAll([status]);
    }
    return this.campaignsService.findAll(status);
  }

  @Get(':id')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }
}
