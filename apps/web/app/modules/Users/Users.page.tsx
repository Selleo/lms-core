import dayjs from "dayjs";
import { EllipsisVertical } from "lucide-react";
import { useAllUsersSuspense } from "~/api/queries/useUsers";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function UsersPage() {
  const { data: users } = useAllUsersSuspense();

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
        <Button>New user</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="hidden sm:table-cell">Role</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow className="bg-accent" key={user.id}>
              <TableCell>
                <div className="font-medium">{user.email}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.role}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
