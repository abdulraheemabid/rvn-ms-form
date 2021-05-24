import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DASClient } from '@abdulraheemabid/rvn-nest-shared';

/**
 * This is a wrapper client which uses the DASClient from rvn-nest-shared package.
 * 
 * It configures the timeout for microservice calls which can be configured in config.json
 */
@Injectable()
export class DasClientService extends DASClient {
    constructor(@Inject('RVN_MS_CLIENT') private client: ClientProxy, @Inject("timeout") private timeoutForMS: number) {
        super(client, new Logger(DasClientService.name, true), timeoutForMS);
    }
}