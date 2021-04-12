import { Module } from '@nestjs/common';
import { DuplicateValuesValidator } from './duplicate-values.validator';
import { FieldArrayValuesValidator } from './field-array-values.validator';

@Module({
  imports: [],
  providers: [DuplicateValuesValidator, FieldArrayValuesValidator],
  exports: [DuplicateValuesValidator, FieldArrayValuesValidator]
})
export class ValidatorModule { }
