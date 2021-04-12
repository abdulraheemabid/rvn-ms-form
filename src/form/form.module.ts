import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { DasClientModule } from 'src/das-client/das-client.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  providers: [FormService, ConfigService],
  imports: [DasClientModule]
})
export class FormModule { }
