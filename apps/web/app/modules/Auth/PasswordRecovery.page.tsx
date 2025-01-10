import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { usePasswordRecovery } from "~/api/mutations/useRecoverPassword";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

import type { ForgotPasswordBody } from "~/api/generated-api";

const passwordRecoverySchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t("forgotPasswordView.validation.email") }),
  });

export default function PasswordRecoveryPage() {
  const { mutateAsync: recoverPassword } = usePasswordRecovery();
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordBody>({
    resolver: zodResolver(passwordRecoverySchema(t)),
  });

  const onSubmit = (data: ForgotPasswordBody) => {
    recoverPassword({ data }).then(() => {
      toast({
        description: t("forgotPasswordView.toast.resetPassword"),
      });
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {t("forgotPasswordView.header")}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t("forgotPasswordView.subHeader")}
          </p>
        </div>
        <form className="space-y-6" action="#" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("forgotPasswordView.field.email")}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="user@example.com"
              className={cn({ "border-red-500": errors.email })}
              {...register("email")}
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
          </div>
          <Button type="submit" className="w-full">
            {t("forgotPasswordView.button.resetPassword")}
          </Button>
        </form>
        <div className="flex justify-center">
          <Link to="/auth/login" className="text-sm font-medium text-muted-foreground">
            {t("forgotPasswordView.button.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
