import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FormService } from 'src/form/form.service';

@Injectable()
export class RecordSchemaValidatorPipe implements PipeTransform {
  constructor(private formService: FormService) { }

  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
