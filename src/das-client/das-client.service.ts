import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DASClient } from '@abdulraheemabid/rvn-shared';

@Injectable()
export class DasClientService extends DASClient {
    constructor(@Inject('RVN_MS_CLIENT') private client: ClientProxy, @Inject("timeout") private timeoutForMS: number) {
        super(client, new Logger(DasClientService.name), timeoutForMS);
    }
}