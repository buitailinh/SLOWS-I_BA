import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import appConfig from './configs/server.config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import cors from 'cors'
import * as bodyParser from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { CustomIoAdapter } from './configs/websocket/custom-io-adapter';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  appConfig(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // app.use(cors)

  global.onlineUsers = new Map();
  app.use(bodyParser.json({ limit: '50mb' }));
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(corsOptions);
  // app.enableCors();
  app.useWebSocketAdapter(new CustomIoAdapter(app));


  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
