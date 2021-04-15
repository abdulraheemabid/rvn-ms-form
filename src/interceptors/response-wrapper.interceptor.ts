import { IApiResponseWrapper } from '@abdulraheemabid/rvn-shared';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'


@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {

        if (data.status !== undefined
          && data.data !== undefined
          && data.message !== undefined
          && data.statusCode !== undefined) {
          return data;
        }

        const resp: IApiResponseWrapper = {
          status: "success",
          data,
          message: null,
          statusCode: HttpStatus.OK
        }

        return resp;
      })
    );
  }
}
