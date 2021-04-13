import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { FormDTO, FormUpdateDTO } from '../form.dto';
import { FormService } from '../form.service';

@Injectable()
export class DuplicateFieldValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  async transform(value: FormUpdateDTO, metadata: ArgumentMetadata) {

    if (value.fields) {
      // checking if duplicate field names in request
      const fieldNames = value.fields.map(f => f.name);
      const fieldNamesSet = new Set(fieldNames);
      if (fieldNames.length != fieldNamesSet.size) throw new HttpException("More than one field found with same name", HttpStatus.CONFLICT);
    }

    if (value.formId && value.fields) {
      // checking if new field is bieng created with a same name as existing;
      let form = await this.formService.fetchFormById({ formId: value.formId });
      const existingFieldNames = form.fields.map(f => f.name);
      const newFields = value.fields.filter(f => f.id === undefined);
      newFields.forEach(f => {
        if (existingFieldNames.includes(f.name)) throw new HttpException(`Field with name ${f.name} already exists. Send id in the field if want to update existing`, HttpStatus.CONFLICT);
      });
    }

    return value;
  }
}
