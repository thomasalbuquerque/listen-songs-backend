import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { RefreshTokenGuard } from './refresh-token.guard';
import { ExtendedRequest } from '../../common/types/request.type';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { LogoutDto } from './dto/logout.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiForbiddenError } from '../../common/swagger/errors/api-forbidden.error';
import { ReturnTokensDto } from './dto/return-tokens.dto';
import { ReturnMessageDto } from '../../common/dtos/return-message.dto';
import { PayloadDto } from './dto/payload.dto';

@Controller('auth')
@ApiTags('auth')
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post()
  @ApiResponse({ status: 201, type: ReturnTokensDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  login(@Body() loginUserDto: AuthDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  logout(@Req() req: ExtendedRequest, @Body() logoutDto: LogoutDto) {
    return this.authService.logout(req.user.sub, logoutDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: PayloadDto })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getProfile(@Req() req: ExtendedRequest) {
    return req.user;
  }

  @SkipAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiResponse({ status: 201, type: ReturnTokensDto })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  refreshTokens(@Req() req: ExtendedRequest) {
    const userId = req.user.sub;
    const refreshToken = req.refreshToken;
    return this.authService.refreshToken(userId, refreshToken);
  }

  @SkipAuth()
  @Post('forgot-password')
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @SkipAuth()
  @Post('reset-password')
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('email-confirm-request')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  emailConfirmRequest(@Req() req: ExtendedRequest) {
    return this.authService.emailConfirmRequest(req.user.sub);
  }

  @Post('email-confirm-validation')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: ReturnMessageDto })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  emailConfirmValidation(
    @Req() req: ExtendedRequest,
    @Body() emailConfirmationDto: EmailConfirmationDto,
  ) {
    return this.authService.emailConfirmValidation(
      req.user.sub,
      emailConfirmationDto.code,
    );
  }
}
