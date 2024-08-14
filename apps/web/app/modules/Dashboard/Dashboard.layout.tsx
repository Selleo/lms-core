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
import { DashboardNavigation } from "./DashboardNavigation/DashboardNavigation";

export const clientLoader = () => authGuard();

export default function DashboardLayout() {
  useAuthEffect();
  const { mutate: logout } = useLogoutUser();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center bg-muted/40 px-4 py-2 sm:px-6">
        <div className="flex-shrink-0 ml-auto items-center flex gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full self-end"
              >
                <Avatar>
                  <AvatarImage src={`https://ui-avatars.com/api/?name=User`} />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings">Settings</Link>
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

      <div className="flex flex-1 overflow-hidden">
        <DashboardNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
