import { HttpExceptionCustomMessages, IApiResponseWrapper } from '@abdulraheemabid/rvn-shared';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnhandledExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {

    const message = exception?.response?.message || exception?.message || HttpExceptionCustomMessages[exception?.response?.statusCode] || "Request unsuccessfull";
    const statusCode = exception?.statusCode || exception?.response?.statusCode || 500;

    //TODO: uncomment when changed to microservice
    // const pattern = host
    //   .switchToRpc()
    //   .getContext<TcpContext>()
    //   .getPattern();

    let args = null;

    try {
      //TODO: uncomment when changed to microservice
      //args = JSON.stringify(host.switchToRpc().getData());
    } catch (error) { }


    const response: IApiResponseWrapper = {
      status: "failure",
      data: null,
      message,
      statusCode
    };

    //TODO: uncomment when changed to microservice
    //this.logger.error(`failed: outgoing for pattern: ${pattern} | args: ${args}`);
    this.logger.error(`error`);

    //TODO: uncomment when changed to microservice
    //return new Observable(sub => { throw response; });
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse();
    resp.status(statusCode).json(response);
  }
}
