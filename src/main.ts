import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnhandledExceptionFilter } from './filters/exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // useContainer(app.select(FormModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  app.useGlobalFilters(new UnhandledExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
