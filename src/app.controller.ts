import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './common/decorators/skip-auth.decorator';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiInternalServerErrorError } from './common/swagger/errors/api-internal-server-error.error';

@Controller()
@ApiTags('health')
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipAuth()
  @Get('health')
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  health(): string {
    return this.appService.health();
  }
}
