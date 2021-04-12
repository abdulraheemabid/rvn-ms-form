import { Injectable } from "@nestjs/common/decorators";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@Injectable()
@ValidatorConstraint({ name: 'DuplicateValuesValidator', async: false })
export class DuplicateValuesValidator implements ValidatorConstraintInterface {
  public async validate(val: any, args: ValidationArguments): Promise<boolean> {

    if (val && Array.isArray(val) && val.length > 1) {
      return new Set(val).size === val.length
    }
    
    return true;
  }

  public defaultMessage(args: ValidationArguments): string {
    return `Duplicate values in array`;
  }
}
