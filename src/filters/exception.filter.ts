import { HttpExceptionCustomMessages, IApiResponseWrapper } from '@abdulraheemabid/rvn-shared';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TcpContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnhandledExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {

    let message = exception?.error?.message || exception?.response?.message || exception?.message || HttpExceptionCustomMessages[exception?.response?.statusCode] || "Request unsuccessfull";
    message = this.convertToFormAndRecordNaming(message);
    const statusCode = exception?.error?.statusCode || exception?.statusCode || exception?.response?.statusCode || 500;

    const pattern = host
      .switchToRpc()
      .getContext<TcpContext>()
      .getPattern();

    let args = null;

    try {
      args = JSON.stringify(host.switchToRpc().getData());
    } catch (error) { }


    const response: IApiResponseWrapper = {
      status: "failure",
      data: null,
      message,
      statusCode
    };

    this.logger.error(`failed: outgoing for pattern: ${pattern} | args: ${args}`);

    return new Observable(sub => { throw response; });
  }

  convertToFormAndRecordNaming(message: string | string[]) {

    if (Array.isArray(message)) {
      message.forEach(m => {
        m = m.replace(/Definition/g, "Form")
          .replace(/definition/g, "form")
          .replace(/Entry/g, "Record")
          .replace(/entry/g, "record")
          .replace(/entries/g, "records")
      });
      return message;
    } else {
      return message.replace(/Definition/g, "Form")
        .replace(/definition/g, "form")
        .replace(/Entry/g, "Record")
        .replace(/entry/g, "record")
        .replace(/entries/g, "records")
    }
  }
}
