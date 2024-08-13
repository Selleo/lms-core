import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Control } from "react-hook-form";
import { editFormSchema } from "../zodFormType.js";
import { CustomSelect } from "../CustomSelect.js";

interface FormSelectInterface {
  control: Control<z.infer<typeof editFormSchema>>;
  name: "title" | "status" | "description" | "video";
  defaultValue: string;
  label: string;
}

export const FormSelect = ({
  control,
  name,
  defaultValue,
  label,
}: FormSelectInterface) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              <FormLabel>{label}</FormLabel>
              <CustomSelect
                value={field.value || defaultValue}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                selectItems={[
                  {
                    selectItemList: ["Published first", "Draft first"],
                  },
                ]}
              />
            </>
          </FormControl>
          <div className="min-h-5">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
