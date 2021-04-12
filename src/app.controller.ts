import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Request } from 'express';
import { DasClientService } from './das-client/das-client.service';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  getHello(@Req() request: Request) {
    //console.log(this.appService);
  }
}
