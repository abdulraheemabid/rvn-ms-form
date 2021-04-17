import { FieldTypeEnum } from '@abdulraheemabid/rvn-nest-shared';
import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { FormService } from 'src/form/form.service';
import { RecordDTO, RecordUpdateDTO } from '../record.dto';
import * as moment from 'moment';
import { getRCPException } from 'src/utils/exception.util';

@Injectable()
export class RecordSchemaValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  async transform(value: RecordDTO | RecordUpdateDTO, metadata: ArgumentMetadata) {
    if (value && value.entry && value.formId) {

      let form = await this.formService.fetchFormById({ formId: value.formId });

      const entry = value.entry;
      const formFields = form.fields;

      // required fields are present or not?
      const rquiredFieldIds = formFields.filter(f => f.required).map(f => f.id.toString());
      const notProvidedRequiredFields = rquiredFieldIds.filter(f => !Object.keys(entry).includes(f));
      if (notProvidedRequiredFields.length > 0) throw getRCPException({ message: `Field ids [${notProvidedRequiredFields.join(",")}] are required but not provided`, statusCode: HttpStatus.NOT_ACCEPTABLE });

      Object.keys(entry).forEach(key => {
        const fieldOfKey = formFields.find(f => f.id.toString() === key.toString());

        // unknown field ids
        if (!fieldOfKey)
          throw getRCPException({ message: `Field id ${key} not found in form's fields`, statusCode: HttpStatus.NOT_FOUND });

        // field type match
        else if (!this.isValueOfSameTypeAsInDefinition(key, entry[key], fieldOfKey))
          throw getRCPException({ message: `Value of field id ${key} doesnt match type defined in form '${fieldOfKey.type}'`, statusCode: HttpStatus.NOT_ACCEPTABLE })
      });

      return value;
    }
    return value;
  }

  isValueOfSameTypeAsInDefinition(fieldId: string, value: any, fieldOfKey: any) {
    switch (fieldOfKey.type) {
      case FieldTypeEnum.BOOL:
        return typeof value === "boolean";
      case FieldTypeEnum.DATE:
        return moment(value).isValid();
      case FieldTypeEnum.FLOAT:
        return typeof value === "number"
      case FieldTypeEnum.INT:
        return typeof value === "number" && !value.toString().includes(".");
      case FieldTypeEnum.STRING:
        return typeof value === "string";
      case FieldTypeEnum.SINGLESELECT:
        switch (true) {
          case typeof value === "string" && fieldOfKey?.arrayValues.includes(value):
            return true;
          case typeof value !== "string":
            return false;
          default:
            throw getRCPException({ message: `Field ${fieldId}'s value is not one of the allowed values`, statusCode: HttpStatus.NOT_ACCEPTABLE });
        }
      case FieldTypeEnum.MULTISELECT:
        switch (true) {
          case Array.isArray(value) && value.every(i => fieldOfKey?.arrayValues.includes(i)):
            return true;
          case !Array.isArray(value):
            return false;
          default:
            throw getRCPException({ message: `One of the field ${fieldId}'s value is not one of the allowed values`, statusCode: HttpStatus.NOT_ACCEPTABLE });
        }
      default:
        return false;
    }
  }
}
