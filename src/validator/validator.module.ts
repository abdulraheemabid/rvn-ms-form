import { Module } from '@nestjs/common';
import { DuplicateValuesInArrayValidator } from './duplicate-values-in-array.validator';
import { FieldArrayValuesValidator } from './field-array-values.validator';

@Module({
  imports: [],
  providers: [DuplicateValuesInArrayValidator, FieldArrayValuesValidator],
  exports: [DuplicateValuesInArrayValidator, FieldArrayValuesValidator]
})
export class ValidatorModule { }
