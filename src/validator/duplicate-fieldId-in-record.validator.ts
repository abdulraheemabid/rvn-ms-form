import { Injectable } from "@nestjs/common/decorators";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@Injectable()
@ValidatorConstraint({ name: 'DuplicateFieldIdInRecordValidator', async: false })
export class DuplicateFieldIdInRecordValidator implements ValidatorConstraintInterface {
  public async validate(value: any, args: ValidationArguments): Promise<boolean> {

    if (value && Array.isArray(value)) {
      const fieldNames = value.map(f => f.name);
      const fieldNamesSet = new Set(fieldNames);
      return fieldNames.length === fieldNamesSet.size
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    return `More than one field found with same name`;
  }
}

