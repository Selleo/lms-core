import { Email } from "../email.interface";

export abstract class EmailAdapter {
  abstract sendMail(email: Email): Promise<void>;
}
