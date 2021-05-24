import { EntryResponseDTO, IdDTO } from '@abdulraheemabid/rvn-nest-shared';
import { Body, Controller, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RecordDeleteDTO, RecordDTO, RecordIdDTO, RecordSearchDTO, RecordUpdateDTO } from 'src/Record/Record.dto';
import { RecordService } from 'src/Record/Record.service';
import { modules, serviceName } from 'src/utils/constants.utils';
import { OnDeleteNewParentValidatorPipe } from './pipes/on-delete-new-parent-validator.pipe';
import { ParentValidatorPipe } from './pipes/parent-validator.pipe';
import { RecordSchemaValidatorPipe } from './pipes/record-schema-validator.pipe';

/**
 * Client facing interface of the microservice.
 * 
 * Controller's job is to
 * 1. To expose its methods with message patterns.
 * 2. Handle input validation.
 * 3. Call relevant service and return.
 * 
 * There should not be any business logic here.
 * 
 * When creating new methods, make sure to use the same method name in messagePattern
 */
@Controller()
export class RecordController {
    constructor(private service: RecordService) { }

    /**
    * MessagePattern: `{ service: serviceName, module: record, method: "fetchAllRecords" }`
    */
    @MessagePattern({ service: serviceName, module: modules.record, method: "fetchAllRecords" })
    async fetchAllRecords(@Body() recordSearchDTO: RecordSearchDTO): Promise<EntryResponseDTO[]> {
        return await this.service.fetchAllRecords(recordSearchDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: record, method: "fetchARecordById" }`
    */
    @MessagePattern({ service: serviceName, module: modules.record, method: "fetchARecordById" })
    async fetchARecordById(@Body() recordIdDTO: RecordIdDTO): Promise<EntryResponseDTO> {
        return await this.service.fetchRecordById(recordIdDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: record, method: "createRecord" }`
    * 
    * Validations:
    * 1. Valid record schema.
    * 2. Valid parent.
    */
    @MessagePattern({ service: serviceName, module: modules.record, method: "createRecord" })
    @UsePipes(RecordSchemaValidatorPipe)
    @UsePipes(ParentValidatorPipe)
    async createRecord(@Body() recordDTO: RecordDTO): Promise<IdDTO> {
        return await this.service.createRecord(recordDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: record, method: "updateRecord" }`
    * 
    * Validations:
    * 1. Valid record schema.
    * 2. Valid parent.
    */
    @MessagePattern({ service: serviceName, module: modules.record, method: "updateRecord" })
    @UsePipes(RecordSchemaValidatorPipe)
    @UsePipes(ParentValidatorPipe)
    async updateRecord(@Body() recordDTO: RecordUpdateDTO): Promise<IdDTO> {
        return await this.service.updateRecord(recordDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: record, method: "deleteRecord" }`
    */
    @MessagePattern({ service: serviceName, module: modules.record, method: "deleteRecord" })
    @UsePipes(OnDeleteNewParentValidatorPipe)
    async deleteRecord(@Body() recordDeleteDTO: RecordDeleteDTO): Promise<IdDTO> {
        return await this.service.deleteRecord(recordDeleteDTO);
    }
}
