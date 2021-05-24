import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { getRCPException } from 'src/utils/exception.util';
import { FormUpdateDTO } from '../form.dto';
import { FormService } from '../form.service';

/**
 * It validates if there are fields with duplicate names, which is not allowed
 */
@Injectable()
export class DuplicateFieldValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  async transform(value: FormUpdateDTO, metadata: ArgumentMetadata): Promise<FormUpdateDTO> {

    if (value.formId && value.fields) {
      // checking if new field is bieng created with a same name as existing;
      let form = await this.formService.fetchFormById({ formId: value.formId });
      const existingFieldNames = form.fields.map(f => f.name);
      const newFields = value.fields.filter(f => f.id === undefined);
      newFields.forEach(f => {
        if (existingFieldNames.includes(f.name)) throw getRCPException({ message: `Field with name ${f.name} already exists. Send id in the field if want to update existing`, statusCode: HttpStatus.CONFLICT });
      });
    }

    return value;
  }
}
