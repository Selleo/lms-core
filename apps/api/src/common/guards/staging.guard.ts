import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class StagingGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const onlyStaging = this.reflector.get<boolean>(
      "onlyStaging",
      context.getHandler(),
    );
    if (!onlyStaging) {
      return true;
    }
    return process.env.NODE_ENV === "staging";
  }
}
