import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { RecordDTO } from 'src/Record/Record.dto';
import { RecordService } from 'src/Record/Record.service';
import { Request } from 'express';
import { RecordSchemaValidatorPipe } from './pipes/record-schema-validator.pipe';

@Controller('forms/:formId/record')
export class RecordController {
    constructor(private service: RecordService) { }

    @Get()
    async fetchAllRecord(@Param("defId") defId: number) {
        return await this.service.fetchAllRecords(defId);
    }

    @Get(":id")
    async fetchARecordById(@Param("defId") defId: number, @Param("id") id: number) {
        return await this.service.fetchRecordById(defId, id);
    }

    @Post()
    @UsePipes(RecordSchemaValidatorPipe)
    async createRecord(@Param("defId") defId: number, @Body() record: RecordDTO, @Req() request: Request) {
        return await this.service.createRecord(defId, record, request);
    }

    @Patch(":id")
    @UsePipes(RecordSchemaValidatorPipe)
    async updateRecord(@Param("defId") defId: number, @Param("id") id: number, @Body() record: RecordDTO, @Req() request: Request) {
        return await this.service.updateRecord(defId, id, record, request);
    }

    @Delete(":id")
    async deleteRecord(@Param("defId") defId: number, @Param("id") id: number) {
        return await this.service.deleteRecord(defId, id);
    }
}
