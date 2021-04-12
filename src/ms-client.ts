import { ClientProxy } from "@nestjs/microservices";
import { tap, catchError, timeout } from 'rxjs/operators'

export class MSClient {
    constructor(private client: ClientProxy, private logger, private timeoutInMs: number) { }

    send(pattern: any, args: any) {
        //TODO: temp
        if (args.request) args.request = {};

        this.logger.log(`Calling RVN_MS_CLIENT | pattern: ${JSON.stringify(pattern)} | args: ${JSON.stringify(args)}`);
        return this.client.send(pattern, args)
            .pipe(
                timeout(this.timeoutInMs),
                catchError(err => {
                    this.logger.error(`RVN_MS_CLIENT threw an exception | pattern: ${JSON.stringify(pattern)} | args: ${JSON.stringify(args)}`);
                    throw err;
                })
            )
            .toPromise();
    }
}