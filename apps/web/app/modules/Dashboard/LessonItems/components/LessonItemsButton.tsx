import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const LessonItemsButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>New</Button>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="add/video">Video</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="add/text">Text</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};
