import { GenericObject } from "@abdulraheemabid/rvn-nest-shared";
import { IsNumber, IsObject, IsOptional } from "class-validator";

export class RecordDTO {
    @IsNumber()
    formId: number

    @IsObject()
    entry: any;

    @IsOptional()
    @IsObject()
    attributes?: GenericObject

    request: Request
}

export class RecordUpdateDTO {
    @IsNumber()
    formId: number

    @IsNumber()
    id: number

    @IsOptional()
    @IsObject()
    entry: any;

    @IsOptional()
    @IsObject()
    attributes?: GenericObject

    request: Request
}

export class RecordIdDTO {
    @IsNumber()
    formId: number

    @IsNumber()
    recordId: number
}