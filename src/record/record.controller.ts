import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from 'src/Record/Record.dto';
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
    async fetchARecordById(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.fetchRecordById(recordIdDTO);
    }

    @Post()
    @UsePipes(RecordSchemaValidatorPipe)
    async createRecord(@Body() recordDTO: RecordDTO) {
        return await this.service.createRecord(recordDTO);
    }

    @Patch(":id")
    @UsePipes(RecordSchemaValidatorPipe)
    async updateRecord(@Body() recordDTO: RecordUpdateDTO) {
        return await this.service.updateRecord(recordDTO);
    }

    @Delete(":id")
    async deleteRecord(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.deleteRecord(recordIdDTO);
    }
}
