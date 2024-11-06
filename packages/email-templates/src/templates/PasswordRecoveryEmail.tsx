import { Button, Html } from "@react-email/components";

export type PasswordRecoveryEmailProps = {
  email: string;
  name: string;
  resetLink: string;
};

export const PasswordRecoveryEmail = ({ email, name, resetLink }: PasswordRecoveryEmailProps) => {
  return (
    <Html>
      <Button
        href="https://selleo.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Hello there! {name}({email})
      </Button>

      <p>Your recovery token: {resetLink}</p>
    </Html>
  );
};

export default PasswordRecoveryEmail;
