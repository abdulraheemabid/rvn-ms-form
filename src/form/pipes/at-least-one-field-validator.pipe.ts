import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { FormUpdateDTO } from 'src/form/form.dto';
import { FormService } from 'src/form/form.service';

@Injectable({ scope: Scope.REQUEST })
export class AtLeastOneFieldValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  formId = null;


  async transform(value: FormUpdateDTO, metadata: ArgumentMetadata) {

    if ((typeof value === "number" || typeof value === "string") && metadata.type === "param") {
      this.formId = value;
      return value;
    }

    if (typeof value === "object" && metadata.type === "body") {
      console.log("formid", this.formId);
      let form = await this.formService.fetchFormById(this.formId);

      const existingFieldCount = form.fields.length;
      const fieldsToBeDeleted = value.fields.filter(f => f.markDeleted === true).length;
      const fieldsToBeAdded = value.fields.filter(f => f.id === undefined).length;
      console.log("existingFieldCount", existingFieldCount);
      console.log("fieldsToBeDeleted", fieldsToBeDeleted);
      console.log("fieldsToBeAdded", fieldsToBeAdded);
      if (existingFieldCount - fieldsToBeDeleted + fieldsToBeAdded < 1)
        throw new HttpException("Form should have atleast one field", HttpStatus.NOT_ACCEPTABLE);
    }
    
    return value;
  }
}
