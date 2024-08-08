import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { extractToken } from "src/utils/extract-token";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = extractToken(request, "refresh_token");

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
      });

      request["user"] = payload;
      request["refreshToken"] = refreshToken;

      return true;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
