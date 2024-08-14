import { useUsers } from "~/api/queries/useUsers";
import { TableData } from "~/components/Table/TableData";
import { columns } from "../Users/components/columns";
import { useToast } from "~/components/ui/use-toast";
import { TableUsersButtons } from "./UsersOptionButtons/TableUsersButtons";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { useState, startTransition } from "react";

const UserButton = () => (
  <Link to="create" target="_blank">
    <Button>Create User</Button>
  </Link>
);

export default function UsersPage() {
  const [page, setPage] = useState<number>(0);
  const pageSize = 2;
  const {
    data: { data: users, pagination },
  } = useUsers(page + 1, pageSize);

  const dbLength = pagination?.totalItems;
  const { toast } = useToast();
  const setToast = () =>
    toast({
      description: "Archived",
    });

  const handleNextPage = () => {
    if (users.length < pageSize) return;
    startTransition(() => {
      setPage((prev: number) => prev + 1);
    });
  };
  const handlePreviousPage = () => {
    if (page === 0) return;
    startTransition(() => {
      setPage((prev: number) => prev - 1);
    });
  };
  const handleSelectPage = (page: number) => {
    startTransition(() => {
      setPage(page);
    });
  };

  return (
    <PageWrapper header="Users" PageWrapperButton={UserButton}>
      <TableData
        setToast={setToast}
        Buttons={TableUsersButtons}
        columns={columns}
        data={users}
        page={page}
        pageSize={pageSize}
        dbLength={dbLength}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleSelectPage={handleSelectPage}
      />
    </PageWrapper>
  );
}
