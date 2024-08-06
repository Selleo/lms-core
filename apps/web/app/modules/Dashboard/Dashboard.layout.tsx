import { Link, Outlet } from "@remix-run/react";
import { useLogoutUser } from "~/api/mutations/useLogoutUser";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuthEffect } from "../Auth/authEffect";
import { authGuard } from "../Auth/authGuard";
import ThemeToggle from "~/components/ThemeToggle/ThemeToggle";
import { LessonItemsProvider } from "./LessonItemsContext";

export function clientLoader() {
  return authGuard();
}

export default function DashboardLayout() {
  useAuthEffect();
  const { mutate: logout } = useLogoutUser();

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 py-2 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <ThemeToggle />
        <div className="flex-shrink-0 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full self-end"
              >
                <Avatar>
                  <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="ghost" onClick={() => logout()}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <LessonItemsProvider>
        <Outlet />
      </LessonItemsProvider>
    </div>
  );
}
