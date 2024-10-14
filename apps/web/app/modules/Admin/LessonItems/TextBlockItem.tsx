import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { capitalize, startCase } from "lodash-es";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUpdateTextBlockItem } from "~/api/mutations/admin/useUpdateTextBlockItem";
import {
  GetLessonItemByIdResponse,
  UpdateTextBlockItemBody,
} from "~/api/generated-api";

type TextBlockType = Extract<
  GetLessonItemByIdResponse["data"],
  { itemType: "text-block" }
>;

interface TextBlockItemProps {
  id: string;
  initialData: TextBlockType;
  onUpdate: () => void;
}

export const TextBlockItem: React.FC<TextBlockItemProps> = ({
  id,
  initialData,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateTextBlockItem } = useUpdateTextBlockItem();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateTextBlockItemBody>({
    defaultValues: {
      title: initialData.title,
      body: initialData.body || "",
      state: initialData.state,
      archived: initialData.archived,
    },
  });

  const onSubmit = (data: UpdateTextBlockItemBody) => {
    console.log({ textBlockId: id });
    updateTextBlockItem({
      data,
      textBlockId: id,
    }).then(() => {
      onUpdate();
      setIsEditing(false);
    });
  };

  const renderField = (name: keyof UpdateTextBlockItemBody) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "archived") {
            return (
              <span className="font-semibold">
                {field.value ? "Archived" : "Active"}
              </span>
            );
          }
          return <span className="font-semibold">{field.value as string}</span>;
        }

        if (name === "state") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string | undefined}
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

        if (name === "body") {
          return (
            <Textarea
              {...field}
              value={field.value as string}
              placeholder={`Enter ${startCase(name)}`}
              className="resize-none"
            />
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
        <h2 className="text-2xl font-bold text-gray-900">Text Block Item</h2>
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
        {(["title", "body", "state", "archived"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-y-1">
            <Label htmlFor={field}>
              {field === "archived" ? "Status" : startCase(field)}
            </Label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </form>
  );
};
