import { Injectable } from "@nestjs/common/decorators";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Validates if there are any duplicates in an array
 */
@Injectable()
@ValidatorConstraint({ name: 'DuplicateValuesInArrayValidator', async: false })
export class DuplicateValuesInArrayValidator implements ValidatorConstraintInterface {
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

