import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { FormDTO, FormUpdateDTO } from 'src/form/form.dto';
import { FormService } from 'src/form/form.service';
import { getRCPException } from 'src/utils/exception.util';

@Injectable()
export class DuplicateFormValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }
  async transform(value: FormDTO | FormUpdateDTO, metadata: ArgumentMetadata) {
    if (value.name) {
      let form = await this.formService.fetchFormByName(value.name);
      if (form) throw getRCPException({ message: `Form with the same name already exists.`, statusCode: HttpStatus.CONFLICT });
    }
    return value;
  }
}
