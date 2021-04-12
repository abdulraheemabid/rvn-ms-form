import { FieldTypeEnum, getAllowedFieldTypesConcatedString } from "@abdulraheemabid/rvn-shared";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, MinLength, Validate, ValidateNested } from "class-validator";
import { DuplicateFormNameValidationPipe } from "src/pipes/duplicate-form-validation.pipe";
import { DuplicateValuesValidationPipe } from "src/pipes/duplicate-values-validation.pipe";
import { FieldArrayValuesValidationPipe } from "src/pipes/field-array-values-validation.pipe";

export class FormDTO {
    @MinLength(3)
    @IsString()
    @Validate(DuplicateFormNameValidationPipe)
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
    @Validate(DuplicateValuesValidationPipe)
    fields?: FormFieldDTO[];

    @IsOptional()
    @IsObject()
    attributes?: JSON;
}

export class FormFieldDTO {
    @MinLength(3)
    @IsString()
    name: string;

    @Validate(FieldArrayValuesValidationPipe)
    @IsEnum(FieldTypeEnum, { message: `type must be: ${getAllowedFieldTypesConcatedString(" | ")}` })
    type: FieldTypeEnum;

    @IsBoolean()
    required: boolean;

    @IsString()
    @IsOptional()
    validationRegex?: string;

    @IsOptional()
    @Validate(DuplicateValuesValidationPipe)
    arrayValues?: string[];

    @IsOptional()
    @IsObject()
    attributes?: JSON;
}

