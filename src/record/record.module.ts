import { Module } from '@nestjs/common';
import { DasClientModule } from 'src/das-client/das-client.module';
import { FormService } from 'src/form/form.service';
import { RelationModule } from 'src/relation/relation.module';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  controllers: [RecordController],
  providers: [RecordService, FormService],
  imports: [DasClientModule, RelationModule],
  exports: [RecordService]
})
export class RecordModule { }
