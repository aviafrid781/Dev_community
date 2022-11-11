import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserI } from './interfaces/user.interface';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserI => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
