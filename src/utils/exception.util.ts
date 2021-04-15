import { ICustomException } from "@abdulraheemabid/rvn-shared";
import { RpcException } from "@nestjs/microservices";

export function getRCPException(exception: ICustomException) {
    return new RpcException(exception);
}