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
import type { LoginBody } from "~/api/generated-api";

const createNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    },
  );

export default function CreateNewPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBody & { passwordConfirmation: string }>({
    resolver: zodResolver(createNewPasswordSchema),
  });

  const onSubmit = (data: LoginBody) => {
    console.log(data);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create new password</CardTitle>
        <CardDescription>
          Enter a new password for user@example.com
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className={cn({ "border-red-500": errors.password })}
              {...register("password")}
            />
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            </div>
            <Input
              id="passwordConfirmation"
              type="password"
              className={cn({ "border-red-500": errors.passwordConfirmation })}
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <div className="text-red-500 text-sm">
                {errors.passwordConfirmation.message}
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
