import { Injectable } from '@nestjs/common';
import * as nconf from 'nconf';
import * as path from 'path';

/**
 * Reads config.json file from root folder. 
 * 
 * Add methods and interfaces of your config properties here to obtain them and use in app.
 */
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