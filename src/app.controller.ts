import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller("definitions")
export class AppController {
  constructor(
    private readonly appService: AppService,
    //@Inject('RVN_MS_CLIENT') private client: ClientProxy
    ) { }

  // @Get()
  // getHello(@Req() request: Request) {
  //   return this.client.send({ route: 'post:definition' }, { name: 1, user: { id: 1 } }).toPromise();
  // }

  // @Get()
  // async fetchAll() {
  //   return this.client.send({ service: "das", method: "GET", route: "definitions" }, {}).toPromise();
  // }

  // @Get(`:id`)
  // async fetch(@Param("id") definition: number): Promise<any> {
  //   return this.client.send({ route: 'get:definitions/:id' }, { definitionId: definition }).toPromise();
  // }

  // @Post()
  // async create(@Body() definitionDTO: any, @Req() request: Request): Promise<any> {
  //   definitionDTO.request = {};
  //   return this.client.send({ route: 'post:definitions' }, definitionDTO).toPromise();
  // }

  // @Patch(`:id`)
  // async update(@Param("id") definition: number, @Body() definitionDTO, @Req() request: Request) {
  //   definitionDTO.definitionId = parseInt(definition.toString());
  //   definitionDTO.request = {};
  //   console.log(definitionDTO);
  //   return this.client.send({ route: 'patch:definitions/:id' }, definitionDTO).toPromise();
  // }

  // @Delete(`:id`)
  // async delete(@Param("id") definition: number): Promise<number> {
  //   return this.client.send({ route: 'delete:definitions/:id' }, { definitionId: definition }).toPromise();
  // }
}
