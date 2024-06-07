import { ApiProperty } from '@nestjs/swagger';

export class ApiBadGatewayError {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
