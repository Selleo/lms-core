import { Button, Html, Text } from "@react-email/components";

export type CreatePasswordReminderEmailProps = {
  createPasswordLink: string;
};

export const CreatePasswordReminderEmail = ({
  createPasswordLink,
}: CreatePasswordReminderEmailProps) => {
  return (
    <Html>
      <Text>Hello,</Text>
      <Text>
        This is a friendly reminder that your account is not yet fully set up.
        <br />
        To complete your account setup, please create your password by clicking
        the button below.
      </Text>
      <Button href={createPasswordLink}>Create your password</Button>
      <Text>
        If you have already created your password, please disregard this
        reminder.
      </Text>
    </Html>
  );
};

export default CreatePasswordReminderEmail;
