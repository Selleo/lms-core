import { PropsWithChildren, ReactNode } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetDescription,
  Sheet,
  SheetTitle,
} from "../ui/sheet";

type SheetMenuProps = {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  sheetTitle?: ReactNode;
  sheetDescription?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
};

export default function SheetMenu({
  isSheetOpen,
  setIsSheetOpen,
  sheetTitle,
  sheetDescription,
  side = "left",
  children,
}: PropsWithChildren<SheetMenuProps>) {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side={side}>
        <SheetHeader>
          {sheetTitle && <SheetTitle>{sheetTitle}</SheetTitle>}
          {sheetDescription && (
            <SheetDescription>{sheetDescription}</SheetDescription>
          )}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
