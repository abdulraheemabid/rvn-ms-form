import { FieldTypeEnum, GenericObject, getAllowedFieldTypesConcatedString } from '@abdulraheemabid/rvn-nest-shared';
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString, MinLength, Validate, ValidateNested } from "class-validator";
import { DuplicateValuesInArrayValidator } from "src/validator/duplicate-values-in-array.validator";
import { FieldArrayValuesValidator } from "src/validator/field-array-values.validator";
import { Request } from 'express';
import { DuplicateFieldIdInRecordValidator } from "src/validator/duplicate-fieldId-in-record.validator";
import { ChildRelationType } from 'src/utils/constants.utils';

export class FormAttributesDTO {
    parentForm?: {
        formId: number,
        relatationType: ChildRelationType
    }
    [key: string]: any;
}

export class FormDTO {
    @MinLength(3)
    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDTO)
    @ArrayNotEmpty()
    fields: FormFieldDTO[];

    @IsOptional()
    @IsObject()
    attributes?: FormAttributesDTO;

    request: Request
}

export class FormUpdateDTO {
    @IsNumber()
    formId: number;

    @IsOptional()
    @MinLength(3)
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDTO)
    @ArrayNotEmpty()
    @Validate(DuplicateFieldIdInRecordValidator)
    fields?: FormFieldDTO[];

    @IsOptional()
    @IsObject()
    attributes?: GenericObject;

    request: Request
}

export class FormFieldDTO {
    //need for update case
    @IsOptional()
    @IsNumber()
    id?: number;

    @MinLength(3)
    @IsString()
    name: string;

    @Validate(FieldArrayValuesValidator)
    @IsEnum(FieldTypeEnum, { message: `type must be: ${getAllowedFieldTypesConcatedString(" | ")}` })
    type: FieldTypeEnum;

    @IsBoolean()
    required: boolean;

    @IsString()
    @IsOptional()
    validationRegex?: string;

    @IsOptional()
    @Validate(DuplicateValuesInArrayValidator)
    arrayValues?: string[];

    @IsOptional()
    @IsObject()
    attributes?: GenericObject;

    //need for update case
    @IsOptional()
    @IsBoolean()
    markDeleted?: boolean;
}

export class FormIdDTO {
    @IsNumber()
    formId: number;
}
