import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Control } from "react-hook-form";
import { editFormSchema } from "../zodFormType.js";
import { CustomSelect } from "../CustomSelect.js";

interface FormSelectInterface {
  control: Control<z.infer<typeof editFormSchema>>;
  name: "title" | "status" | "description" | "video";
}

import { useState } from "react";

export const FormSelect = ({ control, name }: FormSelectInterface) => {
  const [updateField, setUpdateField] = useState<string>("");
  // TODO the value does not refresh in UI
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <>
              {"xd:" + field.value}
              <CustomSelect
                value={field.value ? `Status: ${field.value}` : `Select status`}
                onValueChange={(value) => {
                  field.onChange(value);
                  console.log(field.value);
                }}
                selectItems={[
                  {
                    selectItemList: ["Published first", "Draft first"],
                  },
                ]}
              />
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
