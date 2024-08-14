import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Control } from "react-hook-form";
import { CustomSelect } from "../CustomSelect.js";
interface SelectGroupProps {
  labelValue?: string;
  selectItemList: string[];
}
interface FormSelectInterface {
  control: Control;
  name: string;
  defaultValue: string;
  label: string;
  selectItems: SelectGroupProps[];
}

export const FormSelect = ({
  control,
  name,
  defaultValue,
  label,
  selectItems,
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
                selectItems={selectItems}
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
