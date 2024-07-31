import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ operationId: 'get-health', summary: 'health check' })
  @Get('/health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
