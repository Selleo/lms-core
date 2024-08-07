import { columns } from "./components/table/columns";
import { DataTable } from "./components/table/DataTable";

import { LessonItemsButton } from "./components/LessonItemsButton.js";
import { TableOptionButtons } from "./components/TableOptionButtons/TableOptionButtons";
import { Outlet } from "@remix-run/react";
import { useLessonItems } from "../LessonItemsContext";

interface DataItemWithOptions {
  id: string;
  name: string;
  displayName: string;
  options: JSX.Element;
}

export default function ListItemsLayout() {
  const { lessonItems, setLessonItems } = useLessonItems();

  const dataWithOptions: DataItemWithOptions[] = lessonItems.map((item) => ({
    ...item,
    options: (
      <TableOptionButtons
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
      <DataTable columns={columns} data={dataWithOptions} />
      <Outlet />
    </div>
  );
}
