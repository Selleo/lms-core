import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { ForgotPasswordBody } from "~/api/generated-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { usePasswordRecovery } from "~/api/mutations/useRecoverPassword";
import { useToast } from "~/components/ui/use-toast";

const passwordRecoverySchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export default function PasswordRecoveryPage() {
  const { mutateAsync: recoverPassword } = usePasswordRecovery();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordBody>({
    resolver: zodResolver(passwordRecoverySchema),
  });

  const onSubmit = (data: ForgotPasswordBody) => {
    recoverPassword({ data }).then(() => {
      toast({
        description:
          "A link to reset your password has been sent to your email.",
      });
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter the email address associated with your account and we&apos;ll
            send you a link to reset your password.
          </p>
        </div>
        <form
          className="space-y-6"
          action="#"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="user@example.com"
              className={cn({ "border-red-500": errors.email })}
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>
        <div className="flex justify-center">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-muted-foreground"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
