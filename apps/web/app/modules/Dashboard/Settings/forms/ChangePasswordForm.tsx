import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordBody } from "~/api/generated-api";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useChangePassword } from "~/api/mutations/useChangePassword";
import { cn } from "~/lib/utils";

const passwordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export default function ChangePasswordForm() {
  const { mutate: changePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordBody>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = (data: ChangePasswordBody) => {
    changePassword({ data });
  };

  return (
    <Card id="user-info">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Update your password here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input
            id="oldPassword"
            className={cn({ "border-red-500 focus:!ring-red-500": errors.oldPassword })}
            {...register("oldPassword", {
              required: "Old password is required",
            })}
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.oldPassword.message}
            </p>
          )}
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            className={cn({ "border-red-500 focus:!ring-red-500": errors.newPassword })}
            {...register("newPassword", {
              required: "New password is required",
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Save</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
