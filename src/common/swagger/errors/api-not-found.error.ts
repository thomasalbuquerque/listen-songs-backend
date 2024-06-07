import { ApiProperty } from '@nestjs/swagger';

export class ApiNotFoundError {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
