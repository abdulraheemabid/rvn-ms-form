import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UnhandledExceptionFilter } from './filters/unhandled-exception.filter';
import { FormModule } from './form/form.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  app.useGlobalFilters(new UnhandledExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  useContainer(app.select(FormModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
