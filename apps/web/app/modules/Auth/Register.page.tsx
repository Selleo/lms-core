import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRegisterUser } from "~/api/mutations/useRegisterUser";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { RegisterBody } from "~/api/generated-api";

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function RegisterPage() {
  const { mutate: registerUser } = useRegisterUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterBody>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterBody) => {
    registerUser({ data });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" type="text" placeholder="John" {...register("firstName")} />
            {errors.firstName && (
              <div className="text-red-500 text-sm">{errors.firstName.message}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" type="text" placeholder="Doe" {...register("lastName")} />
            {errors.lastName && (
              <div className="text-red-500 text-sm">{errors.lastName.message}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" {...register("email")} />
            {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password.message}</div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
