import { ICustomException } from '@abdulraheemabid/rvn-nest-shared';
import { RpcException } from "@nestjs/microservices";

export function getRCPException(exception: ICustomException) {
    return new RpcException(exception);
}