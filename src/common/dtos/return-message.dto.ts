import { ApiProperty } from '@nestjs/swagger';

export class ReturnMessageDto {
  @ApiProperty()
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
