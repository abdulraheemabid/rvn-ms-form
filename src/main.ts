import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UnhandledExceptionFilter } from './filters/unhandled-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // useContainer(app.select(FormModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  app.useGlobalFilters(new UnhandledExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
