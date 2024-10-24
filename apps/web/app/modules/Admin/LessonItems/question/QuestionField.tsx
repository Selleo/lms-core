import { capitalize, startCase } from "lodash-es";
import { Controller, Control } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { UpdateQuestionItemBody } from "~/api/generated-api";

interface QuestionFieldProps {
  name: keyof UpdateQuestionItemBody;
  control: Control<UpdateQuestionItemBody>;
  isEditing: boolean;
}

export const QuestionField = ({
  name,
  control,
  isEditing,
}: QuestionFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "archived") {
            return (
              <span className="font-semibold capitalize">
                {field.value ? "Archived" : "Active"}
              </span>
            );
          }
          if (name === "questionType") {
            return (
              <span className="font-semibold">
                {capitalize(startCase(field.value as string))}
              </span>
            );
          }
          if (name === "questionBody" || name === "solutionExplanation") {
            return (
              <p className="whitespace-pre-wrap font-semibold">
                {field.value as string}
              </p>
            );
          }
          return <span className="font-semibold">{field.value as string}</span>;
        }

        if (name === "questionType") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a question type" />
              </SelectTrigger>
              <SelectContent>
                {["single_choice", "multiple_choice", "open_answer"].map(
                  (type) => (
                    <SelectItem value={type} key={type}>
                      {capitalize(startCase(type))}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          );
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

        if (name === "questionBody" || name === "solutionExplanation") {
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
};
