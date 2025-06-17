import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { LoggingService } from './common/logging/logging.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const document = readFileSync(join(__dirname, '..', 'doc/api.yaml'), 'utf8');
  SwaggerModule.setup('/doc', app, parse(document));

  app.useGlobalPipes(new ValidationPipe());

  const logger = app.get(LoggingService);

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', err.stack);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}/doc`);
  });
}
bootstrap();
