import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ExtendedRequest } from '../../common/types/request.type';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';

@Controller('settings')
@ApiTags('settings')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getMe(@Req() req: ExtendedRequest, @Query('deviceId') deviceId: string) {
    return this.settingsService.getMe(req.user.sub, deviceId);
  }

  @Patch()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  updateMe(
    @Req() req: ExtendedRequest,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateMe(req.user.sub, updateSettingsDto);
  }

  @Patch('/mobiles/:deviceId')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  updateMobileFirebaseToken(
    @Req() req: ExtendedRequest,
    @Param('deviceId') deviceId: string,
    @Body() updateMobileDto: UpdateMobileDto,
  ) {
    return this.settingsService.updateMobileFirebaseToken(
      req.user.sub,
      deviceId,
      updateMobileDto,
    );
  }
}
