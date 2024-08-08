import { Button, Html } from "@react-email/components";

export type WelcomeEmailProps = {
  email: string;
  name: string;
};

export const WelcomeEmailTwo = ({ email, name }: WelcomeEmailProps) => {
  return (
    <Html>
      <Button
        href="https://selleo.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Howdy! {name}({email})
      </Button>
    </Html>
  );
};

export default WelcomeEmailTwo;
