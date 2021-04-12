import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { FormDTO, FormUpdateDTO } from './form.dto';
import { FormService } from './form.service';
import { Request } from 'express';

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
    async createForm(@Body() form: FormDTO, @Req() request: Request) {
        return await this.service.createForm(form, request);
    }

    @Patch(":id")
    async updateForm(@Param("id") id: number, @Body() form: FormUpdateDTO, @Req() request: Request) {
        return await this.service.updateForm(id, form, request);
    }

    @Delete(":id")
    async deleteForm(@Param("id") id: number) {
        return await this.service.deleteForm(id);
    }

}
