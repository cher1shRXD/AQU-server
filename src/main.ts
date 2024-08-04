import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig: { port: number } = config.get('server');
  setupSwagger(app);
  app.enableCors({
    origin: 'https://aqu-cloud.kro.kr',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Origin',
      'Accept',
      'X-Requested-With',
      'Content-Type',
      'Authorization',
    ],
    preflightContinue: false,
  });
  await app.listen(serverConfig.port, '0.0.0.0');
}
bootstrap();
