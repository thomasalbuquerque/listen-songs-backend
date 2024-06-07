import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ReturnMessageDto } from '../../common/dtos/return-message.dto';

@Controller('health')
@ApiTags('health')
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SkipAuth()
  @Get('version/iphone')
  @ApiOperation({ summary: 'Get version of iphone' })
  @ApiResponse({ status: 200, type: ReturnMessageDto })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getVersionIphone(): Promise<ReturnMessageDto> {
    return this.healthService.getVersionIphone();
  }

  @SkipAuth()
  @Get('version/android')
  @ApiOperation({ summary: 'Get version of android' })
  @ApiResponse({ status: 200, type: ReturnMessageDto })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getVersionAndroid(): Promise<ReturnMessageDto> {
    return this.healthService.getVersionAndroid();
  }

  @SkipAuth()
  @Get('version/server')
  @ApiOperation({ summary: 'Get version of server' })
  @ApiResponse({ status: 200, type: ReturnMessageDto })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getVersionServer(): Promise<ReturnMessageDto> {
    return this.healthService.getVersionServer();
  }

  @SkipAuth()
  @Get('version/dashboard')
  @ApiOperation({ summary: 'Get version of dashboard' })
  @ApiResponse({ status: 200, type: ReturnMessageDto })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getVersionDashboard(): Promise<ReturnMessageDto> {
    return this.healthService.getVersionDashboard();
  }
}
