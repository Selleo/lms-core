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
          <Link to="add/video">
            <DropdownMenuItem className="cursor-pointer">
              Video
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link to="add/text">
            <DropdownMenuItem className="cursor-pointer">Text</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};
