import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useLoginUser } from "~/api/mutations/useLoginUser";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginBody } from "~/api/generated-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FormCheckbox } from "~/components/Form/FormCheckbox";
import { Input } from "~/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync: loginUser } = useLoginUser();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginBody>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginBody) => {
    loginUser({ data }).then(() => {
      navigate("/");
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle role="heading" className="text-2xl">
          Login
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              className={cn({ "border-red-500": errors.email })}
              {...register("email")}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
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
          <FormCheckbox
            control={control}
            name="rememberMe"
            label="Remember me"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
