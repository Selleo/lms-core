import { useAllUsersSuspense } from "~/api/queries/useUsers";
import { TableData } from "~/components/Table/TableData";
import { columns } from "../Users/components/columns";
import { useToast } from "~/components/ui/use-toast";
import { TableUsersButtons } from "./UsersOptionButtons/TableUsersButtons";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { UserTableFilter } from "./components/UserTableFilter";

const UserButton = () => (
  <Link to="create" target="_blank">
    <Button>Create User</Button>
  </Link>
);

export default function UsersPage() {
  const { data: users } = useAllUsersSuspense();
  const { toast } = useToast();
  const setToast = () =>
    toast({
      description: "Archived",
    });

  return (
    <PageWrapper header="Users" PageWrapperButton={UserButton}>
      <UserTableFilter />
      <TableData
        setToast={setToast}
        Buttons={TableUsersButtons}
        columns={columns}
        data={users}
      />
    </PageWrapper>
  );
}
