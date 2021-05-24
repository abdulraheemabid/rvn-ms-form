import { Body, Controller, UsePipes } from '@nestjs/common';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { DuplicateFormValidatorPipe } from 'src/form/pipes/duplicate-form-validator.pipe';
import { AtLeastOneFieldValidatorPipe } from 'src/form/pipes/at-least-one-field-validator.pipe';
import { DuplicateFieldValidatorPipe } from './pipes/duplicate-field-validator.pipe';
import { modules, serviceName } from 'src/utils/constants.utils';
import { MessagePattern } from '@nestjs/microservices';
import { ParentValidatorPipe } from './pipes/parent-validator.pipe';
import { DefinitionResponseDTO, IdDTO } from '@abdulraheemabid/rvn-nest-shared';
import { RelationEntity } from 'src/database/relation.entity';

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
export class FormController {

    constructor(private service: FormService) { }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "fetchAllForms" }`
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchAllForms" })
    async fetchAllForms(): Promise<DefinitionResponseDTO[]> {
        return await this.service.fetchAllForms();
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "fetchAllFormTrees" }`
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchAllFormTrees" })
    async fetchAllFormTrees(): Promise<RelationEntity[]> {
        return await this.service.fetchAllFormTrees();
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "fetchFormById" }`
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchFormById" })
    async fetchFormById(@Body() formIdDTO: FormIdDTO): Promise<DefinitionResponseDTO> {
        return await this.service.fetchFormById(formIdDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "fetchFormDirectChildren" }`
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchFormDirectChildren" })
    async fetchFormDirectChildren(@Body() formIdDTO: FormIdDTO): Promise<number[]> {
        return await this.service.fetchFormDirectChildren(formIdDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "createForm" }`
    * 
    * Validations:
    * 1. FormDTO's validations.
    * 2. Duplicate form name.
    * 3. Duplicate field name.
    * 4. Valid parent form id.
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "createForm" })
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    @UsePipes(ParentValidatorPipe)
    async createForm(@Body() formDTO: FormDTO): Promise<IdDTO> {
        return await this.service.createForm(formDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "updateForm" }`
    * 
    * Validations:
    * 1. FormUpdateDTO's validations.
    * 2. Duplicate form name.
    * 3. Duplicate field name.
    * 4. At least one field.
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "updateForm" })
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(AtLeastOneFieldValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    async updateForm(@Body() formDTO: FormUpdateDTO): Promise<IdDTO> {
        return await this.service.updateForm(formDTO);
    }

    /**
    * MessagePattern: `{ service: serviceName, module: form, method: "deleteForm" }`
    */
    @MessagePattern({ service: serviceName, module: modules.form, method: "deleteForm" })
    async deleteForm(@Body() formIdDTO: FormIdDTO): Promise<IdDTO> {
        return await this.service.deleteForm(formIdDTO);
    }

}
