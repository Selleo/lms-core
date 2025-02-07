import * as bcrypt from "bcryptjs";

export default function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
