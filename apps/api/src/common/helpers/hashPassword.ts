import * as bcrypt from "bcrypt";

export default function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
