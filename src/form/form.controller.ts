import { Body, Controller, UsePipes } from '@nestjs/common';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { DuplicateFormValidatorPipe } from 'src/form/pipes/duplicate-form-validator.pipe';
import { AtLeastOneFieldValidatorPipe } from 'src/form/pipes/at-least-one-field-validator.pipe';
import { DuplicateFieldValidatorPipe } from './pipes/duplicate-field-validator.pipe';
import { modules, serviceName } from 'src/utils/constants.utils';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FormController {

    constructor(private service: FormService) { }

    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchAllForms" })
    async fetchAllForms() {
        return await this.service.fetchAllForms();
    }

    @MessagePattern({ service: serviceName, module: modules.form, method: "fetchFormById" })
    async fetchFormById(@Body() formIdDTO: FormIdDTO) {
        return await this.service.fetchFormById(formIdDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.form, method: "createForm" })
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    async createForm(@Body() formDTO: FormDTO) {
        return await this.service.createForm(formDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.form, method: "updateForm" })
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(AtLeastOneFieldValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    async updateForm(@Body() formDTO: FormUpdateDTO) {
        return await this.service.updateForm(formDTO);
    }

    @MessagePattern({ service: serviceName, module: modules.form, method: "deleteForm" })
    async deleteForm(@Body() formIdDTO: FormIdDTO) {
        return await this.service.deleteForm(formIdDTO);
    }

}
