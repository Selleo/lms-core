import { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

interface Form {
  onSubmit: (data: any) => void;
  form: UseFormReturn<any>;
  children: React.ReactElement;
  onCancel: () => void;
}

export const LMSForm = ({ onSubmit, form, children, onCancel }: Form) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto px-12 md:w-3/5 w-4/5"
      >
        <div className="grid md:grid-cols-2 gap-6 grid-cols-1 items-end">
          {children}
          <div className="flex space-x-4 my-10">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Back
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
