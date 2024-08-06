import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NormalAdminTokenVerifyService } from '@src/util/grpc/interface/normal-admin-verify.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AdminGuard.name);

  private readonly normalAdminTokenVerifyService: NormalAdminTokenVerifyService;

  constructor(
    private readonly reflector: Reflector,

    @Inject('normal-admin-token-verify-client-grpc')
    private readonly normalAdminGrpcClient: ClientGrpc,
  ) {
    this.normalAdminTokenVerifyService =
      this.normalAdminGrpcClient.getService<NormalAdminTokenVerifyService>(
        'NormalAdminTokenVerifyService',
      );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers?.authorization;

    if (!token) {
      this.logger.warn(`No token headers: ${request.headers}`);
      throw new UnauthorizedException('No token');
    }

    // Verify token
    return await this.validateNormalAdminToken(token);
  }

  /**
   * Normal admin 토큰 검증
   * @param token
   * @returns
   */
  private async validateNormalAdminToken(token: string): Promise<boolean> {
    try {
      const { user_id: userId } = await firstValueFrom(
        this.normalAdminTokenVerifyService.verifyNormalAdminToken({ token }),
      );

      if (!userId) {
        throw new UnauthorizedException({ message: 'No Authorization' });
      }

      this.logger.debug(
        `Normal Admin Permission Guard token: ${token}, userId : ${userId}`,
      );

      return true;
    } catch (e: any) {
      this.logger.error(e.message);

      // Admin server가 running 하고 있지 않을 때
      // 혹은 통신이 불가능 할 때
      if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
        throw new InternalServerErrorException(
          `Please, check admin-server running.`,
        );
      }

      throw new UnauthorizedException(e.message);
    }
  }
}
