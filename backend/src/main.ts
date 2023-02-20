import 'dotenv-defaults/config';
const mandatoryEnvironmentVariables = ['BACKEND_URL', 'DATABASE_URL'];
const missingEnvironmentVariables = mandatoryEnvironmentVariables.filter(
  (variable) => !process.env[variable],
);
if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Environment variables [${missingEnvironmentVariables.join(
      ', ',
    )}] not defined, terminating...`,
  );
  process.exit(1);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
