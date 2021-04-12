import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UsePipes } from '@nestjs/common';
import { FormDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { Request } from 'express';
import { DuplicateFormValidatorPipe } from 'src/pipes/duplicate-form-validator.pipe';
import { AtLeastOneFieldValidatorPipe } from 'src/pipes/at-least-one-field-validator.pipe';

@Controller('forms')
export class FormController {

    constructor(private service: FormService) { }

    @Get()
    async fetchAllFroms() {
        return await this.service.fetchAllForms();
    }

    @Get(":id")
    async fetchAFromsById(@Param("id") id: number) {
        return await this.service.fetchFormById(id);
    }

    @Post()
    @UsePipes(DuplicateFormValidatorPipe)
    async createForm(@Body() form: FormDTO, @Req() request: Request) {
        return await this.service.createForm(form, request);
    }

    @Patch(":id")
    @UsePipes(DuplicateFormValidatorPipe)
    @UsePipes(AtLeastOneFieldValidatorPipe)
    async updateForm(@Param("id") id: number, @Body() form: FormUpdateDTO, @Req() request: Request) {
        return await this.service.updateForm(id, form, request);
    }

    @Delete(":id")
    async deleteForm(@Param("id") id: number) {
        return await this.service.deleteForm(id);
    }

}
