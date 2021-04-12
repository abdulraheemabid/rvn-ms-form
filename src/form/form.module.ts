import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DasClientModule } from 'src/das-client/das-client.module';
import { ValidatorModule } from 'src/form/validator/validator.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  imports: [DasClientModule, ValidatorModule],
  providers: [FormService, ConfigService],
  exports: [FormService]
})
export class FormModule { }
