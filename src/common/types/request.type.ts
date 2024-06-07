import { Request } from '@nestjs/common';
export interface ExtendedRequest extends Request {
  user: {
    sub: string; //user id
    iat: number; //issued at
    exp: number; //expires
  };
  refreshToken?: string;
}
