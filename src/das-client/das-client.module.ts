import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { ConfigService } from 'src/config/config.service';
import { DasClientService } from './das-client.service';

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
