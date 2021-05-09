import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DasClientModule } from 'src/das-client/das-client.module';
import { RecordModule } from 'src/record/record.module';
import { RelationModule } from 'src/relation/relation.module';
import { RelationService } from 'src/relation/relation.service';
import { ValidatorModule } from 'src/validator/validator.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  imports: [DasClientModule, ValidatorModule, RelationModule, RecordModule],
  providers: [FormService, ConfigService],
  exports: [FormService]
})
export class FormModule { }
