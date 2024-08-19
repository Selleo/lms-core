import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "src/users/schemas/user-roles";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdmin = this.reflector.getAllAndOverride<boolean>("isAdmin", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies["access_token"];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.getUserById(payload.userId);

      if (!user || user.role !== UserRoles.admin) {
        return false;
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
