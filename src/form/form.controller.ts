import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { Request } from 'express';
import { DuplicateFormValidatorPipe } from 'src/form/pipes/duplicate-form-validator.pipe';
import { AtLeastOneFieldValidatorPipe } from 'src/form/pipes/at-least-one-field-validator.pipe';

@Controller('forms')
export class FormController {

    constructor(private service: FormService) { }

    @Get()
    async fetchAllForms() {
        return await this.service.fetchAllForms();
    }

    @Get(":id")
    async fetchAFormsById(@Body() formIdDTO: FormIdDTO) {
        return await this.service.fetchFormById(formIdDTO);
    }

    @Post()
    @UsePipes(DuplicateFormValidatorPipe)
    async createForm(@Body() formDTO: FormDTO) {
        return await this.service.createForm(formDTO);
    }

    @Patch(":id")
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(AtLeastOneFieldValidatorPipe)
    async updateForm(@Body() formDTO: FormUpdateDTO) {
        return await this.service.updateForm(formDTO);
    }

    @Delete(":id")
    async deleteForm(@Body() formIdDTO: FormIdDTO) {
        return await this.service.deleteForm(formIdDTO);
    }

}
