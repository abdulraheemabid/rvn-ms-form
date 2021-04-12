import { IsNumber, IsObject, IsOptional } from "class-validator";

export class RecordDTO{
    @IsObject()
    entry: any;

    @IsOptional()
    @IsObject()
    attributes?: JSON
}