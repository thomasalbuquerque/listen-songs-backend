import { ApiProperty } from '@nestjs/swagger';

export class ApiInternalServerErrorError {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
