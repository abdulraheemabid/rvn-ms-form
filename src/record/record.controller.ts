import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FormIdDTO } from 'src/form/form.dto';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from 'src/Record/Record.dto';
import { RecordService } from 'src/Record/Record.service';
import { modules, serviceName } from 'src/utils/constants.utils';
import { ParentValidatorPipe } from './pipes/parent-validator.pipe';
import { RecordSchemaValidatorPipe } from './pipes/record-schema-validator.pipe';

@Controller()
export class RecordController {
    constructor(private service: RecordService) { }

    @MessagePattern({ service: serviceName, module: modules.record, method: "fetchAllRecords" })
    async fetchAllRecords(@Body() formIdDTO: FormIdDTO) {
        return await this.service.fetchAllRecords(formIdDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.record, method: "fetchARecordById" })
    async fetchARecordById(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.fetchRecordById(recordIdDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.record, method: "createRecord" })
    @UsePipes(RecordSchemaValidatorPipe)
    @UsePipes(ParentValidatorPipe)
    async createRecord(@Body() recordDTO: RecordDTO) {
        return await this.service.createRecord(recordDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.record, method: "updateRecord" })
    @UsePipes(RecordSchemaValidatorPipe)
    @UsePipes(ParentValidatorPipe)
    async updateRecord(@Body() recordDTO: RecordUpdateDTO) {
        return await this.service.updateRecord(recordDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.record, method: "deleteRecord" })
    async deleteRecord(@Body() recordIdDTO: RecordIdDTO) {
        return await this.service.deleteRecord(recordIdDTO);
    }
}
