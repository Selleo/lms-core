import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useChangePassword } from "~/api/mutations/useChangePassword";
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
import { cn } from "~/lib/utils";

import type { ChangePasswordBody } from "~/api/generated-api";

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
  const { t } = useTranslation();

  const onSubmit = (data: ChangePasswordBody) => {
    changePassword({ data });
  };

  return (
    <Card id="user-info">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{t("changePasswordView.header")}</CardTitle>
          <CardDescription>{t("changePasswordView.subHeader")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="oldPassword">{t("changePasswordView.field.oldPassword")}</Label>
          <Input
            id="oldPassword"
            className={cn({
              "border-red-500 focus:!ring-red-500": errors.oldPassword,
            })}
            {...register("oldPassword", {
              required: t("changePasswordView.validation.oldPassword"),
            })}
          />
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
          )}
          <Label htmlFor="newPassword">{t("changePasswordView.field.newPassword")}</Label>
          <Input
            id="newPassword"
            className={cn({
              "border-red-500 focus:!ring-red-500": errors.newPassword,
            })}
            {...register("newPassword", {
              required: t("changePasswordView.validation.newPassword"),
            })}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">{t("common.button.save")}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
