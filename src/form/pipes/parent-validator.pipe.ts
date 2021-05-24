import { FormDTO } from 'src/form/form.dto';
import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { getRCPException } from 'src/utils/exception.util';
import { FormService } from '../form.service';

/**
 * It validated if provided parentFormId is a valid form.
 */
@Injectable()
export class ParentValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }
  async transform(value: FormDTO, metadata: ArgumentMetadata): Promise<FormDTO> {
    if (value.attributes?.parentForm?.formId) {
      try {
        await this.formService.fetchFormById({ formId: value.attributes.parentForm.formId });
      } catch (error) {
        throw getRCPException({ message: `Form ${value.attributes.parentForm.formId} does not exists and cannot be set as a parent form`, statusCode: HttpStatus.NOT_FOUND });
      }
    }
    return value;
  }
}
