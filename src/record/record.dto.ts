import { GenericObject } from "@abdulraheemabid/rvn-nest-shared";
import { IsNumber, IsObject, IsOptional } from "class-validator";
import { Request } from 'express';
import { FormIdDTO } from "src/form/form.dto";


export class RecordParentDTO {
    @IsNumber()
    recordId: number
}
export class RecordAttributesDTO {
    @IsOptional()
    @IsObject()
    parent?: RecordParentDTO;

    [key: string]: any;
}

export class RecordDTO {
    @IsNumber()
    formId: number

    @IsObject()
    entry: any;

    @IsOptional()
    @IsObject()
    attributes?: RecordAttributesDTO

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
    attributes?: RecordAttributesDTO

    request: Request
}

export class RecordIdDTO {
    @IsNumber()
    formId: number;

    @IsNumber()
    recordId: number;

    request?: Request;
}

export class RecordSearchDTO extends FormIdDTO {
    @IsObject()
    @IsOptional()
    searchOptions?: GenericObject;
    @IsNumber()
    @IsOptional()
    parentId?: number;
}

export class RecordDeleteDTO extends RecordIdDTO {
    @IsOptional()
    @IsNumber()
    newParentIdForChildren?: number;
}