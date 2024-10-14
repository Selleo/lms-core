import { useParams } from "@remix-run/react";
import { capitalize, startCase } from "lodash-es";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateUserBody } from "~/api/generated-api";
import { useAdminUpdateUser } from "~/api/mutations/useAdminUpdateUser";
import { useUserById } from "~/api/queries/useUserById";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Loader from "~/modules/common/Loader/Loader";

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
    console.log(data);
    updateUser({ data, userId: id });
    setIsEditing(false);
  };

  const UserInfoItem: React.FC<{ name: keyof UpdateUserBody }> = ({ name }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={user[name] as UpdateUserBody[typeof name]}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "archived") {
            return (
              <span className="font-semibold capitalize">
                {user[name] ? "Archived" : "Active"}
              </span>
            );
          }
          return (
            <span className="font-semibold capitalize">
              {user[name]?.toString()}
            </span>
          );
        }

        if (name === "role") {
          return (
            <Select
              onValueChange={field.onChange}
              value={field.value as UpdateUserBody["role"] | undefined}
            >
              <SelectTrigger className="w-full rounded-md border border-neutral-300 px-2 py-1">
                <SelectValue
                  placeholder={capitalize(field.value as string)}
                  className="capitalize"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["student", "admin", "tutor"].map((role) => (
                    <SelectItem className="capitalize" value={role} key={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }

        if (name === "archived") {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="archived"
                checked={field.value as boolean | undefined}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <label
                htmlFor="archived"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Archived
              </label>
            </div>
          );
        }

        return (
          <Input
            {...field}
            value={field.value as string}
            type={name === "email" ? "email" : "text"}
            className="w-full rounded-md border border-neutral-300 px-2 py-1"
          />
        );
      }}
    />
  );

  return (
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
            <UserInfoItem name={field} />
          </div>
        ))}
      </div>
    </form>
  );
};

export default User;
