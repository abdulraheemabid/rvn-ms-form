import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from 'src/config/config.service';
import { DasClientService } from './das-client.service';

@Module({
    providers: [
        DasClientService,
        ConfigService
    ],
    imports: [
        ClientsModule.register([
            { name: 'RVN_MS_CLIENT', transport: Transport.TCP }
        ])
    ],
    exports: [
        DasClientService,
        ClientsModule.register([
            { name: 'RVN_MS_CLIENT', transport: Transport.TCP }
        ])
    ]
})
export class DasClientModule { }
