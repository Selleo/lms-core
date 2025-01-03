import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateNewPassword } from "~/api/mutations/useCreateNewPassword";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

import type { ResetPasswordBody } from "~/api/generated-api";
import { useTranslation } from "react-i18next";

const createNewPasswordSchema = z
  .object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPasswordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine(({ newPassword, newPasswordConfirmation }) => newPassword === newPasswordConfirmation, {
    message: "Passwords don't match",
    path: ["newPasswordConfirmation"],
  });

export default function CreateNewPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const resetToken = searchParams.get("resetToken");
  const createToken = searchParams.get("createToken");
  const email = searchParams.get("email");
  const { mutateAsync: createNewPassword } = useCreateNewPassword({
    isCreate: !resetToken,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordBody & { newPasswordConfirmation: string }>({
    resolver: zodResolver(createNewPasswordSchema),
    mode: "onChange",
  });
  const { t } = useTranslation();

  const onSubmit = (data: ResetPasswordBody) => {
    if (resetToken) {
      createNewPassword({
        data: { newPassword: data.newPassword, resetToken: resetToken },
      }).then(() => {
        toast({
          description: t("passwordChangedSuccessfully"),
        });
        navigate("/auth/login");
      });
    }

    if (createToken) {
      createNewPassword({
        data: { password: data.newPassword, createToken: createToken },
      }).then(() => {
        toast({
          description: t("passwordCreatedSuccessfully"),
        });
        navigate("/auth/login");
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("createNewPassword")}</CardTitle>
        <CardDescription>
          {t("enterNewPasswordFor")} {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">{t("password")}</Label>
            <Input
              id="newPassword"
              type="password"
              className={cn({ "border-red-500": errors.newPassword })}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <div className="text-red-500 text-sm">{errors.newPassword.message}</div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="newPasswordConfirmation">{t("confirmPassword")}</Label>
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
              <div className="text-red-500 text-sm">{errors.newPasswordConfirmation.message}</div>
            )}
          </div>
          <Button type="submit" className="w-full">
            {t("changePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
