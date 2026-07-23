import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The app defaults to localhost:3000, so serve there unless told otherwise.
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
