import { FieldTypeEnum, getAllowedFieldTypesConcatedString } from "@abdulraheemabid/rvn-shared";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, isBoolean, IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString, MinLength, Validate, ValidateNested } from "class-validator";
import { DuplicateValuesValidator } from "src/form/validator/duplicate-values.validator";
import { FieldArrayValuesValidator } from "src/form/validator/field-array-values.validator";


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
    attributes?: JSON;
}

export class FormUpdateDTO {
    @IsOptional()
    @MinLength(3)
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDTO)
    @ArrayNotEmpty()
    @Validate(DuplicateValuesValidator)
    fields?: FormFieldDTO[];

    @IsOptional()
    @IsObject()
    attributes?: JSON;
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
    @Validate(DuplicateValuesValidator)
    arrayValues?: string[];

    @IsOptional()
    @IsObject()
    attributes?: JSON;

    //need for update case
    @IsOptional()
    @IsBoolean()
    markDeleted?: boolean;
}
