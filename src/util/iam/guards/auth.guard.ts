import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import authConfig from 'src/configs/auth.config';
import { Public } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) {
      // 퍼블릭 허용 API 인 경우
      const isPublic = this.reflector.get(Public, context.getHandler());
      if (isPublic) {
        request.userId = null;

        return true;
      }

      // 토큰이 존재하지 않는 경우는 401 오류를 반환합니다.
      this.logger.warn(`No token headers: ${request.headers}`);
      throw new UnauthorizedException('No token');
    }

    // Verify token
    try {
      const { userId: userId } = this.jwtService.verify<{
        userId: string;
      }>(token, {
        secret: this.config.JWT_ACCESS_SECRET,
      });

      // If not exists userId
      if (!userId) {
        this.logger.error(`UserId must exists INPUT(userId=${userId})`);
        throw new UnauthorizedException();
      }

      // Set user id, get using @UserID
      request['userId'] = userId;
    } catch (e) {
      this.logger.warn(`Failed to validate token(${token}), ${e}`);
      throw new UnauthorizedException('Failed to validate token');
    }

    return true;
  }

  /**
   * 토큰 가져오기
   * @param request
   * @returns
   */
  private extractToken(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
