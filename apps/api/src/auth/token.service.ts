import { Injectable } from "@nestjs/common";
import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "./consts";

@Injectable()
export class TokenService {
  setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      path: "/auth/refresh",
    });
  }

  clearTokenCookies(response: Response) {
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");
  }
}
