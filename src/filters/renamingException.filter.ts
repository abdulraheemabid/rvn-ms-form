import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Observable } from 'rxjs';


@Catch()
export class RenamingExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    if (exception?.error?.message) {
      exception.error.message = this.convertToFormAndRecordNaming(exception.error.message);
    }

    if (exception?.response?.message) {
      exception.response.message = this.convertToFormAndRecordNaming(exception.response.message);
    }

    if (exception?.message) {
      exception.message = this.convertToFormAndRecordNaming(exception.message);
    }

    return new Observable(sub => { throw exception; });
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
