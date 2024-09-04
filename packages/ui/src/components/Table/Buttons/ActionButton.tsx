import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog.js";
import { Button } from "../../ui/button.js";
import type { IconProps } from "./TableButtons.js";
import { cn } from "@/src/lib/utils.js";

const DIALOG_TEXT = {
  true: {
    description:
      "This action will unarchive the item, restoring it to its original state. Are you sure you want to proceed?",
    button: "Set active",
  },
  false: {
    description:
      "This action will archive the file, and it can be restored at any time. Are you sure you want to proceed?",
    button: "Archive",
  },
};

const BORDER_CLASS =
  "flex items-center justify-center w-8 h-8 border border-solid rounded-md cursor-pointer";

export const ActionButton = ({
  Icon,
  SecondIcon,
  href,
  onClick,
  id,
  archived,
  sourceToTable,
}: {
  SecondIcon?: IconProps;
  Icon: IconProps;
  href: string;
  // eslint-disable-next-line no-unused-vars
  onClick?: (id?: string, archived?: boolean, href?: string) => void;
  archived?: boolean;
  id?: string;
  sourceToTable?: string;
}) => {
  const isArchived = String(archived) as "true" | "false";
  const borderColor =
    archived && SecondIcon ? "border-green-500" : "border-red-500";
  const IconComponent = archived && SecondIcon ? SecondIcon : Icon;
  const iconColor =
    archived && SecondIcon ? "stroke-green-500" : "stroke-red-500";

  return !onClick ? (
    <Link className={cn(BORDER_CLASS, "border-blue-500")} to={href}>
      <Icon className="w-5 stroke-blue-500 fill-none" />
    </Link>
  ) : (
    <Dialog>
      <DialogTrigger className="p-0">
        <p className={cn(BORDER_CLASS, borderColor)}>
          <IconComponent className={`${iconColor} fill-none w-5`} />
        </p>
      </DialogTrigger>
      <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            {DIALOG_TEXT[isArchived].description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              variant={archived ? "default" : "destructive"}
              onClick={() => onClick(id, archived, sourceToTable)}
            >
              {DIALOG_TEXT[isArchived].button}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
