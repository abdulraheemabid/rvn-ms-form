import { CommonLoggingInterceptor, CommonResponseWrapperInterceptor, CommonExceptionFilter } from '@abdulraheemabid/rvn-nest-shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RenamingExceptionFilter } from './filters/renamingException.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options:{
        port: 3002
      }
    },
  );

  app.useGlobalInterceptors(new CommonLoggingInterceptor());
  app.useGlobalInterceptors(new CommonResponseWrapperInterceptor());
  app.useGlobalFilters(new CommonExceptionFilter());
  app.useGlobalFilters(new RenamingExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.listen(() => console.log('rvn-ms-form is listening'));
}
bootstrap();
