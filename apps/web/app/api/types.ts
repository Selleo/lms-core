export type SilentError = {
  __silent: true;
  message: string;
};

export const isSilentError = (err: unknown): err is SilentError =>
  typeof err === "object" &&
  err !== null &&
  "__silent" in err &&
  err.__silent === true;

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public type: "unauthorized" | "unauthenticated"
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}
