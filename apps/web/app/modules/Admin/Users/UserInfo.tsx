import { capitalize } from "lodash-es";
import { memo } from "react";
import { type Control, Controller } from "react-hook-form";

import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { GetUserByIdResponse, UpdateUserBody } from "~/api/generated-api";

export const UserInfo = memo<{
  name: keyof UpdateUserBody;
  control: Control<UpdateUserBody>;
  isEditing: boolean;
  user: GetUserByIdResponse["data"];
}>(({ name, control, isEditing, user }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={user[name] as UpdateUserBody[typeof name]}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "archived") {
            return (
              <span className="font-semibold capitalize">{user[name] ? "Archived" : "Active"}</span>
            );
          }
          return <span className="font-semibold capitalize">{user[name]?.toString()}</span>;
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
});
