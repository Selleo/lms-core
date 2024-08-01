import { Request } from "express";

export function extractToken(
  request: Request,
  cookieName: "refresh_token" | "access_token",
): string | null {
  if (request.cookies && request.cookies[cookieName]) {
    return request.cookies[cookieName];
  }

  if (request.headers.authorization?.startsWith("Bearer ")) {
    return request.headers.authorization.split(" ")[1];
  }

  return null;
}
