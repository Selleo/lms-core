import { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

interface LMSFormProps<T extends FieldValues> {
  onSubmit: (data: T) => void;
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onCancel: () => void;
  layout?: "row" | "column";
  buttonsText?: {
    submit?: string;
    cancel?: string;
  };
  toggleVisibilityCancelButton?: boolean;
}

const layoutClassNames = {
  column: {
    form: "mx-auto px-12 md:w-3/5 w-4/5",
    main: "grid md:grid-cols-2 gap-6 grid-cols-1 items-end",
    buttons: "flex space-x-4 my-10",
  },
  row: {
    form: "w-full",
    main: "flex gap-3 items-end",
    buttons: "flex space-x-4 ml-3 mb-7",
  },
};

const CancelButton = ({
  onCancel,
  text,
}: {
  onCancel: () => void;
  text: string | undefined;
}) => (
  <Button type="button" variant="outline" onClick={onCancel}>
    {text || "Back"}
  </Button>
);

export const LMSForm = <T extends FieldValues>({
  onSubmit,
  form,
  children,
  onCancel,
  layout = "column",
  buttonsText,
  toggleVisibilityCancelButton = false,
}: LMSFormProps<T>) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={layoutClassNames[layout].form}
      >
        <div className={layoutClassNames[layout].main}>
          {children}
          <div className={layoutClassNames[layout].buttons}>
            <Button type="submit">{buttonsText?.submit || "Submit"}</Button>
            {!toggleVisibilityCancelButton && (
              <CancelButton onCancel={onCancel} text={buttonsText?.cancel} />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
