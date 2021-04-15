import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormModule } from './form/form.module';
import { RecordModule } from './record/record.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    FormModule,
    RecordModule
  ],
})
export class AppModule { }
