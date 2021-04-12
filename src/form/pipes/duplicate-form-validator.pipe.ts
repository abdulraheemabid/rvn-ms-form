import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { FormDTO, FormUpdateDTO } from 'src/form/form.dto';
import { FormService } from 'src/form/form.service';

@Injectable()
export class DuplicateFormValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }
  async transform(value: FormDTO | FormUpdateDTO, metadata: ArgumentMetadata) {
    if (value.name) {
      let form = await this.formService.fetchFormByName(value.name);
      if (form) throw new HttpException("Form with the same name already exists.", HttpStatus.CONFLICT);
    }
    return value;
  }
}
