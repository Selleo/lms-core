import { render } from "@react-email/components";
import { EmailContent } from "./email-content";

export function emailTemplateFactory<T extends unknown[]>(
  template: (...args: T) => Parameters<typeof render>[0]
): new (...args: T) => EmailContent {
  return class implements EmailContent {
    private readonly args: T;

    constructor(...args: T) {
      this.args = args;
    }

    get props(): T {
      return this.args;
    }

    get text(): string {
      return render(template(...this.props), { plainText: true });
    }

    get html(): string {
      return render(template(...this.props));
    }
  };
}
