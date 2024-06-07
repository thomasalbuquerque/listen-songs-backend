import { ApiProperty } from '@nestjs/swagger';

export class ApiUnauthorizedError {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
