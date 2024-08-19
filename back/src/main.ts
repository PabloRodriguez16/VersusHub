import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CloudinaryConfig } from './config/cloudinary.config';

async function bootstrap() {
  CloudinaryConfig();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
