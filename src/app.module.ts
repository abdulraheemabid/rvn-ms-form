import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { RecordModule } from './record/record.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    FormModule,
    RecordModule
  ],
})
export class AppModule { }
