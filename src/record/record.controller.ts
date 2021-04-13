import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { FormIdDTO } from 'src/form/form.dto';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from 'src/Record/Record.dto';
import { RecordService } from 'src/Record/Record.service';
import { RecordSchemaValidatorPipe } from './pipes/record-schema-validator.pipe';

@Controller('forms/:formId/record')
export class RecordController {
    constructor(private service: RecordService) { }

    @Post("fetchAllRecords")
    async fetchAllRecords(@Body() formIdDTO: FormIdDTO) {
        return await this.service.fetchAllRecords(formIdDTO);
    }

    @Post("fetchARecordById")
    async fetchARecordById(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.fetchRecordById(recordIdDTO);
    }

    @Post("createRecord")
    @UsePipes(RecordSchemaValidatorPipe)
    async createRecord(@Body() recordDTO: RecordDTO) {
        return await this.service.createRecord(recordDTO);
    }

    @Post("updateRecord")
    @UsePipes(RecordSchemaValidatorPipe)
    async updateRecord(@Body() recordDTO: RecordUpdateDTO) {
        return await this.service.updateRecord(recordDTO);
    }

    @Post("deleteRecord")
    async deleteRecord(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.deleteRecord(recordIdDTO);
    }
}
