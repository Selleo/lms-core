import { capitalize, startCase } from "lodash-es";
import { Controller, useForm } from "react-hook-form";

import type { GetLessonItemByIdResponse, UpdateTextBlockItemBody } from "~/api/generated-api";
import { useUpdateTextBlockItem } from "~/api/mutations/admin/useUpdateTextBlockItem";
import Editor from "~/components/RichText/Editor";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

type TextBlockType = Extract<GetLessonItemByIdResponse["data"], { itemType: "text_block" }>;

interface TextBlockItemProps {
  id: string;
  initialData: TextBlockType;
  onUpdate: () => void;
}

export const TextBlockItem: FC<TextBlockItemProps> = ({ id, initialData, onUpdate }) => {
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
    updateTextBlockItem({
      data,
      textBlockId: id,
    }).then(() => {
      onUpdate();
    });
  };

  const renderField = (name: keyof UpdateTextBlockItemBody) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (name === "state") {
          return (
            <Select onValueChange={field.onChange} defaultValue={field.value as string | undefined}>
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
            <Editor
              id="solutionExplanation"
              content={field.value as string}
              className="h-32 w-full"
              {...field}
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
        <Button type="submit" disabled={!isDirty} className="mr-2">
          Save
        </Button>
      </div>
      <div className="space-y-4">
        {(["title", "body", "state", "archived"] as const).map((field) => (
          <div key={field} className="flex flex-col gap-y-1">
            <Label htmlFor={field}>{field === "archived" ? "Status" : startCase(field)}</Label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </form>
  );
};
