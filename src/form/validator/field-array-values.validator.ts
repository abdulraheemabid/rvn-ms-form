import { FieldTypeEnum } from '@abdulraheemabid/rvn-shared';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'FieldArrayValuesValidator', async: false })
export class FieldArrayValuesValidator implements ValidatorConstraintInterface {
    validate(val: any, args: ValidationArguments): boolean | Promise<boolean> {
        if (val === FieldTypeEnum.ARRAY) {
            const arrayValues = args?.object["arrayValues"];
            return (
                arrayValues
                && Array.isArray(arrayValues)
                && arrayValues.length > 0
                && arrayValues.filter(arrVal => ["", null, undefined, "null", "undefined"].includes(arrVal)).length === 0
            );
        }

        return true;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `arrayValues should not be empty or contain invalid/duplicate values if type is set to ${FieldTypeEnum.ARRAY}`;
    }
}
