import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { winstonLogger } from './configs/winston.config';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpLoggingInterceptor } from './interceptor/http.logging-interceptor';
import { NodeEnv } from './util/enums/node-env.enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 이 설정이 없으면 NestJS 앱이 구동되는 초반에 잠시동안 내장 로거가 사용됨
  });
  app.useLogger(winstonLogger);
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const configService = app.get<ConfigService>(ConfigService);

  const UCC_WEB_URL = configService.getOrThrow<string>('UCC_WEB_URL');
  const NODE_ENV = configService.getOrThrow<NodeEnv>('NODE_ENV');

  app.enableCors({
    origin: UCC_WEB_URL,
    credentials: true,
  });

  // Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      transform: true,
    }),
  );

  // Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger, Do not remove #1, #2
  // #1 Set global prefix to swagger
  if (NODE_ENV === NodeEnv.DEVELOP) {
    app.setGlobalPrefix('market');
    const API_DOC_PATH = configService.getOrThrow<string>('API_DOC_PATH');
    const swaggerConfig = new DocumentBuilder()
        .addSecurity('bearer', {
          type: 'http',
          scheme: 'bearer',
        })
        .setTitle('market server')
        .setDescription('market server API description')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(API_DOC_PATH, app, document);

    // #2 Clear global prefix if dev env to open server
    app.setGlobalPrefix('');
  }

  const SERVER_PORT = configService.getOrThrow<string>('PORT');
  await app.listen(SERVER_PORT);
}
bootstrap();
