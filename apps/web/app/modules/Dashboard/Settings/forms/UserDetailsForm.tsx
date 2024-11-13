import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUpsertUserDetails } from "~/api/mutations";
import { currentUserQueryOptions, useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { useUserDetailsSuspense } from "~/api/queries/useUserDetails";
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
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

import type { UpsertUserDetailsBody } from "~/api/generated-api";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(currentUserQueryOptions);
  return null;
};

const updateUserDetailsSchema = z.object({
  description: z.string(),
  contactEmail: z.string().email(),
  contactPhoneNumber: z.string(),
  jobTitle: z.string(),
});

export default function UserForm() {
  const { data: currentUser } = useCurrentUserSuspense();
  const { data: currentUserDetails } = useUserDetailsSuspense(currentUser?.id ?? "");

  const { mutate: updateUserDetails } = useUpsertUserDetails();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpsertUserDetailsBody>({
    resolver: zodResolver(updateUserDetailsSchema),
  });

  const onSubmit = async (data: UpsertUserDetailsBody) => {
    updateUserDetails({ data });
  };

  return (
    <Card id="user-details">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Change user details information</CardTitle>
          <CardDescription>Update your bio here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="Bio - note">Description</Label>
            <Textarea
              placeholder="Your description"
              {...(currentUserDetails?.description && {
                defaultValue: currentUserDetails.description,
              })}
              className={cn("resize-none min-h-[150px]", {
                "border-red-500 focus:!ring-red-500": errors.description,
              })}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              {...(currentUser?.email && {
                defaultValue: currentUser.email,
              })}
              placeholder="user@email.com"
              className={cn({
                "border-red-500 focus:!ring-red-500": errors.contactEmail,
              })}
              {...register("contactEmail")}
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="contactPhoneNumber">Phone number</Label>
            <Input
              {...(currentUserDetails?.contactPhone && {
                defaultValue: currentUserDetails.contactPhone,
              })}
              placeholder="Your phone number"
              className={cn({
                "border-red-500 focus:!ring-red-500": errors.contactPhoneNumber,
              })}
              {...register("contactPhoneNumber")}
            />
            {errors.contactPhoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.contactPhoneNumber.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="jobTitle">Job title</Label>
            <Input
              {...(currentUserDetails?.jobTitle && {
                defaultValue: currentUserDetails.jobTitle,
              })}
              placeholder="Your job title"
              className={cn({
                "border-red-500 focus:!ring-red-500": errors.jobTitle,
              })}
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Save</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
