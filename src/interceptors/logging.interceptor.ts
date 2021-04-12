import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //TODO: uncomment when changed to microservice
    // const pattern = context
    //   .switchToRpc()
    //   .getContext<TcpContext>()
    //   .getPattern();

    let args = null;

    try {
      //TODO: uncomment when changed to microservice
      //args = JSON.stringify(context.switchToRpc().getData());
    } catch (error) { }

    const now = Date.now();

    //TODO: uncomment when changed to microservice
    //this.logger.log(`incoming for pattern: ${pattern} | args: ${args}`);
      this.logger.log(`incoming for`);
    return next.handle().pipe(
      tap(() => {
        //TODO: uncomment when changed to microservice
        //this.logger.log(`outgoing for pattern: ${pattern} | time: ${Date.now() - now}ms`);
        this.logger.log(`outgoing for`);
      })
    );
  }
}
