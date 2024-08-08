import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Control } from "react-hook-form";
import { editLessonItemFormSchema } from "./zodFormType.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button.js";

interface LessonItemFormDropDownInterface {
  control: Control<z.infer<typeof editLessonItemFormSchema>>;
  name: "title" | "status" | "description" | "video";
}

export const LessonItemFormDropDown = ({
  control,
  name,
}: LessonItemFormDropDownInterface) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">
                  {field.value ? `Status: ${field.value}` : `Select status`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => field.onChange("Published first")}
                  className="cursor-pointer"
                >
                  Published first
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => field.onChange("Draft first")}
                  className="cursor-pointer"
                >
                  Draft first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
