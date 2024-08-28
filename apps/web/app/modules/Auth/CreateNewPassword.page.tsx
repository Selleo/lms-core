import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResetPasswordBody } from "~/api/generated-api";
import { useCreateNewPassword } from "~/api/mutations/useCreateNewPassword";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useToast } from "~/components/ui/use-toast";

const createNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    newPasswordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine(
    ({ newPassword, newPasswordConfirmation }) =>
      newPassword === newPasswordConfirmation,
    {
      message: "Passwords don't match",
      path: ["newPasswordConfirmation"],
    },
  );

export default function CreateNewPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync: createNewPassword } = useCreateNewPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordBody & { newPasswordConfirmation: string }>({
    resolver: zodResolver(createNewPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ResetPasswordBody) => {
    if (token) {
      createNewPassword({
        data: { newPassword: data.newPassword, resetToken: token },
      }).then(() => {
        toast({
          description: "Password changed successfully",
        });
        navigate("/auth/login");
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create new password</CardTitle>
        <CardDescription>Enter a new password for {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Password</Label>
            <Input
              id="newPassword"
              type="password"
              className={cn({ "border-red-500": errors.newPassword })}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <div className="text-red-500 text-sm">
                {errors.newPassword.message}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="newPasswordConfirmation">Confirm Password</Label>
            </div>
            <Input
              id="newPasswordConfirmation"
              type="password"
              className={cn({
                "border-red-500": errors.newPasswordConfirmation,
              })}
              {...register("newPasswordConfirmation")}
            />
            {errors.newPasswordConfirmation && (
              <div className="text-red-500 text-sm">
                {errors.newPasswordConfirmation.message}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
