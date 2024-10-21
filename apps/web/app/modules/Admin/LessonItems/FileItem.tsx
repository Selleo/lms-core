import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { capitalize, startCase } from "lodash-es";
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
import { useUpdateFileItem } from "~/api/mutations/admin/useUpdateFileItem";
import { UpdateFileItemBody } from "~/api/generated-api";

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

export const FileItem: React.FC<FileItemProps> = ({
  id,
  initialData,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
    });
  };

  const renderField = (name: keyof UpdateFileItemBody) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "url")
            return (
              <span className="font-semibold line-clamp-1">{field.value}</span>
            );
          return <span className="font-semibold">{field.value}</span>;
        }

        if (name === "state") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
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
        {isEditing ? (
          <div>
            <Button type="submit" disabled={!isDirty} className="mr-2">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
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
