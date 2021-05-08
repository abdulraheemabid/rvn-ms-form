import { IsNumber, IsObject, IsOptional } from "class-validator";


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
    formId: number

    @IsNumber()
    recordId: number
}