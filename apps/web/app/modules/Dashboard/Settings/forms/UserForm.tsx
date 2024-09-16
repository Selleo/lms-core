import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateUserBody } from "~/api/generated-api";
import { useUpdateUser } from "~/api/mutations/useUpdateUser";
import {
  currentUserQueryOptions,
  useCurrentUserSuspense,
} from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(currentUserQueryOptions);
  return null;
};

const updateUserSchema = z.object({
  email: z.string().email(),
});

export default function UserForm() {
  const { mutate: updateUser } = useUpdateUser();
  const { data: currentUser } = useCurrentUserSuspense();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserBody>({ resolver: zodResolver(updateUserSchema) });

  const onSubmit = (data: UpdateUserBody) => {
    updateUser({ data });
  };

  return (
    <Card id="change-password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Change user information</CardTitle>
          <CardDescription>Update your user information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="user@email.com"
            defaultValue={currentUser?.email}
            className={cn({ "border-red-500": errors.email })}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
