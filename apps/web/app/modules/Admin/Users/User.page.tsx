import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useForm } from "react-hook-form";

import { useAdminUpdateUser } from "~/api/mutations/admin/useAdminUpdateUser";
import { userQueryOptions, useUserById } from "~/api/queries/admin/useUserById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";

import { UserInfo } from "./UserInfo";

import type { UpdateUserBody } from "~/api/generated-api";

const displayedFields: Array<keyof UpdateUserBody> = [
  "firstName",
  "lastName",
  "email",
  "role",
  "archived",
];

const User = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("User ID not found");

  const { data: user, isLoading } = useUserById(id);
  const { mutateAsync: updateUser } = useAdminUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateUserBody>();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (!user) throw new Error("User not found");

  const onSubmit = (data: UpdateUserBody) => {
    updateUser({ data, userId: id }).then(() => {
      queryClient.invalidateQueries(userQueryOptions(id));
    });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">User Information</h2>
          <Button type="submit" disabled={!isDirty} className="mr-2">
            Save
          </Button>
        </div>
        <div className="space-y-4 pt-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-2">
              <Label className="text-neutral-600 font-normal">
                {field === "archived" ? "Status" : startCase(field)}
              </Label>
              <UserInfo name={field} control={control} isEditing user={user} />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default User;
