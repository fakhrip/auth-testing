import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // FIXME: set this to the allowed list of hosts
    cors: {
      origin: '*',
    },
  });
  await app.listen(3000);
}
bootstrap();
