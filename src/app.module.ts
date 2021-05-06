import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from './form/form.module';
import { RecordModule } from './record/record.module';
import { RelationModule } from './relation/relation.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    FormModule,
    RecordModule,
    TypeOrmModule.forRoot(),
    RelationModule,
  ],
})
export class AppModule { }
