import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { ConfigService } from 'src/config/config.service';
import { DasClientService } from './das-client.service';

/**
 * This module wraps the DAS microservice client and handles its configuration.
 * 
 * It opens a TCP connection with port 3001 which DAS microservices is listing on.
 * 
 * TODO: this direct connection with DAS microservice should be removed 
 * and service discovery should be in place.
 */
@Module({
    providers: [
        DasClientService,
        ConfigService,
        {
            provide: "timeout",
            useFactory: (configService: ConfigService) => {
                return configService.getMicroServiceCallTimeout();
            },
            inject: [ConfigService]
        }
    ],
    imports: [
        ClientsModule.register([
            { name: 'RVN_MS_CLIENT', transport: Transport.TCP, options: { port: 3001 } }
        ])
    ],
    exports: [
        DasClientService
    ]
})
export class DasClientModule { }
