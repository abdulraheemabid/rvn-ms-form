import { Injectable } from '@nestjs/common';
import * as nconf from 'nconf';
import * as path from 'path';

@Injectable()
export class ConfigService {
    private readonly msCallTimeout: number;

    constructor() {
        //TODO: handle env specific paths 

        let location = path.join(__dirname, `../../`, `config.json`);

        const config = nconf.argv().env().file({ file: location });

        this.msCallTimeout = config.get('microservice-call-timeout-ms');
    }

    public getMicroServiceCallTimeout(): number {
        return this.msCallTimeout;
    }

}