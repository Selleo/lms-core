import { Outlet } from "@remix-run/react";
import { useToast } from "~/components/ui/use-toast";
import { useLessonItems } from "./LessonItemsContext";
import { TableData } from "~/components/Table/TableData";
import { TableOptionButtons } from "./LessonTableOptionButtons/TableOptionButtons";
import { LessonItemsButton } from "./LessonItemsButton";
import { columns } from "./LessonItemsTable/columns";

interface DataItemWithOptions {
  id: string;
  name: string;
  displayName: string;
  description: string;
  video: string | File | FileList | null;
  options: JSX.Element;
}

export default function ListItemsLayout() {
  const { lessonItems, setLessonItems } = useLessonItems();
  const { toast } = useToast();

  const setToast = () => {
    toast({
      description: "Deleted",
    });
  };

  const dataWithOptions: DataItemWithOptions[] = lessonItems.map((item) => ({
    ...item,
    options: (
      <TableOptionButtons
        setToast={setToast}
        setDataFetch={setLessonItems}
        data={{
          id: item.id,
          displayName: item.displayName,
          description: item.description,
        }}
      />
    ),
  }));

  return (
    <div className="w-4/5 mx-auto">
      <div className="flex justify-end w-full pb-3">
        <LessonItemsButton />
      </div>
      <TableData columns={columns} data={dataWithOptions} />
      <Outlet />
    </div>
  );
}
