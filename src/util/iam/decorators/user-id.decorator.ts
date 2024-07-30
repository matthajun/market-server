import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // 가드적용이 안되어있는 경우
    if (!Object.prototype.hasOwnProperty.call(request, 'userId')) {
      throw new InternalServerErrorException('user id must exists');
    }

    return request.userId;
  },
);
