import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserBody } from "~/api/generated-api";
import { useAdminUpdateUser } from "~/api/mutations/admin/useAdminUpdateUser";
import { useUserById } from "~/api/queries/admin/useUserById";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";
import { UserInfo } from "./UserInfo";

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
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateUserBody>();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  if (!user) throw new Error("User not found");

  const onSubmit = (data: UpdateUserBody) => {
    updateUser({ data, userId: id });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg h-full p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-neutral-950 font-semibold mb-4">
            User Information
          </h2>
          {isEditing ? (
            <div>
              <Button type="submit" disabled={!isDirty} className="mr-2">
                Save
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        <div className="space-y-4 pt-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-2">
              <Label className="text-neutral-600 font-normal">
                {field === "archived" ? "Status" : startCase(field)}
              </Label>
              <UserInfo
                name={field}
                control={control}
                isEditing={isEditing}
                user={user}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default User;
