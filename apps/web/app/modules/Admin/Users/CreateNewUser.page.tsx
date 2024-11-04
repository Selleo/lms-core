import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CreatePageHeader } from "~/modules/Admin/components";
import { queryClient } from "~/api/queryClient";
import { ALL_COURSES_QUERY_KEY } from "~/api/queries/useCourses";
import { useCreateUser } from "~/api/mutations/useCreateUser";
import { useNavigate } from "@remix-run/react";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["student", "admin", "tutor"], {
    required_error: "Please select a role.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewUserPage() {
  const { mutateAsync: createUser } = useCreateUser();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
    },
  });

  const onSubmit = (values: FormValues) => {
    createUser({ data: values }).then(({ data }) => {
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_QUERY_KEY });
      navigate(`/admin/users/${data.id}`);
    });
  };

  const isFormValid = form.formState.isValid;

  return (
    <div className="flex flex-col gap-y-6">
      <CreatePageHeader
        title="Create New User"
        description="Fill in the details to create a new user. Click save when
            you're done."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <FormControl>
                  <Input id="firstName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <FormControl>
                  <Input id="lastName" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <FormControl>
                  <Input id="email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid}>
              Create User
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
