import { isNullOrUndefined } from '@abdulraheemabid/rvn-shared';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
//import { FormService } from 'src/form/form.service';

@Injectable()
@ValidatorConstraint({ name: 'DuplicateFormNameValidationPipe', async: true })
export class DuplicateFormNameValidationPipe implements ValidatorConstraintInterface {
  //constructor(private readonly formService: FormService) { }

  validate(val: any, args: ValidationArguments): boolean | Promise<boolean> {
    
    
    if (val) {
      let form = {}//this.formService.fetchFormByName(val);
      return !isNullOrUndefined(form);
    }

    return true;

  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Form with the same name already exists.`;
  }
}
