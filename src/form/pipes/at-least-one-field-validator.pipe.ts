import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { FormUpdateDTO } from 'src/form/form.dto';
import { FormService } from 'src/form/form.service';

@Injectable({ scope: Scope.REQUEST })
export class AtLeastOneFieldValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  async transform(value: FormUpdateDTO, metadata: ArgumentMetadata) {

    if (value.formId && value.fields) {
      let form = await this.formService.fetchFormById({ formId: value.formId });
      const existingFieldCount = form.fields.length;
      const fieldsToBeDeleted = value.fields.filter(f => f.markDeleted === true).length;
      const fieldsToBeAdded = value.fields.filter(f => f.id === undefined).length;
      if (existingFieldCount - fieldsToBeDeleted + fieldsToBeAdded < 1)
        throw new HttpException("Form should have atleast one field", HttpStatus.NOT_ACCEPTABLE);
    }

    return value;
  }
}
