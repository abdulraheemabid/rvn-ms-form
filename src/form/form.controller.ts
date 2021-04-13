import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { Request } from 'express';
import { DuplicateFormValidatorPipe } from 'src/form/pipes/duplicate-form-validator.pipe';
import { AtLeastOneFieldValidatorPipe } from 'src/form/pipes/at-least-one-field-validator.pipe';
import { DuplicateFieldValidatorPipe } from './pipes/duplicate-field-validator.pipe';

@Controller('forms')
export class FormController {

    constructor(private service: FormService) { }

    @Post("fetchAllForms")
    async fetchAllForms() {
        return await this.service.fetchAllForms();
    }

    @Post("fetchAFormsById")
    async fetchAFormsById(@Body() formIdDTO: FormIdDTO) {
        return await this.service.fetchFormById(formIdDTO);
    }

    @Post("createForm")
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    async createForm(@Body() formDTO: FormDTO) {
        //TODO: temp
        formDTO.request = {} as Request;
        return await this.service.createForm(formDTO);
    }

    @Post("updateForm")
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(AtLeastOneFieldValidatorPipe)
    @UsePipes(DuplicateFieldValidatorPipe)
    async updateForm(@Body() formDTO: FormUpdateDTO) {
        //TODO: temp
        formDTO.request = {} as Request;
        return await this.service.updateForm(formDTO);
    }

    @Post("deleteForm")
    async deleteForm(@Body() formIdDTO: FormIdDTO) {
        return await this.service.deleteForm(formIdDTO);
    }

}
