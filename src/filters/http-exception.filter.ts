import { HttpExceptionCustomMessages, IApiResponseWrapper } from '@abdulraheemabid/rvn-shared';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { RpcException, TcpContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();
    let exceptionResponse = exception.getResponse() as any;
    exceptionResponse = exceptionResponse?.message;
    const message = exceptionResponse || exception.message || HttpExceptionCustomMessages[statusCode] || "Request unsuccessfull";
    let args = null;
    let stringifiedResponse = null;
    //TODO: uncomment when changed to microservice
    //const pattern = host.switchToRpc().getContext<TcpContext>().getPattern();

    const response: IApiResponseWrapper = {
      status: "failure",
      data: null,
      message,
      statusCode
    };

    try {
      //TODO: uncomment when changed to microservice
      //args = JSON.stringify(host.switchToRpc().getData());
      stringifiedResponse = JSON.stringify(response);
    } catch (error) { }


    //TODO: uncomment when changed to microservice
    //this.logger.error(`failed: outgoing for pattern: ${pattern} | args: ${args} | response: ${stringifiedResponse}`);
    this.logger.error(`error`);

    //TODO: uncomment when changed to microservice
    //return new Observable(sub => { throw response; });
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse();
    resp
      .status(statusCode)
      .json(response);
  }
}
