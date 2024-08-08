export type Email = {
  to: string;
  from: string;
  subject: string;
} & (
  | { html: string; text?: never }
  | { text: string; html?: never }
  | { text: string; html: string }
);
