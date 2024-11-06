import { capitalize, startCase } from "lodash-es";
import { Controller, useForm } from "react-hook-form";

import type { UpdateFileItemBody } from "~/api/generated-api";
import { useUpdateFileItem } from "~/api/mutations/admin/useUpdateFileItem";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { FC } from "react";

interface FileItemProps {
  id: string;
  initialData: {
    title: string;
    type: string;
    url: string;
    state: string;
  };
  onUpdate: () => void;
}

export const FileItem: FC<FileItemProps> = ({ id, initialData, onUpdate }) => {
  const { mutateAsync: updateFileItem } = useUpdateFileItem();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateFileItemBody>({
    defaultValues: initialData,
  });

  const onSubmit = (data: UpdateFileItemBody) => {
    updateFileItem({ data, fileId: id }).then(() => {
      onUpdate();
    });
  };

  const renderField = (name: keyof UpdateFileItemBody) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (name === "state") {
          return (
            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {["draft", "published"].map((state) => (
                  <SelectItem value={state} key={state}>
                    {capitalize(state)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return (
          <Input
            {...field}
            value={field.value as string}
            type="text"
            placeholder={`Enter ${startCase(name)}`}
          />
        );
      }}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">File Item</h2>
        <Button type="submit" disabled={!isDirty} className="mr-2">
          Save
        </Button>
      </div>
      <div className="space-y-4">
        {(["title", "type", "url", "state"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-y-1">
            <Label htmlFor={field}>{startCase(field)}</Label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </form>
  );
};
