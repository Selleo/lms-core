import { TableOptionButtons } from "../../../components/LessonItems/TableOptionButtons/TableOptionButtons";
import { Outlet } from "@remix-run/react";
import { useLessonItems } from "../LessonItemsContext";
import { columns } from "~/components/LessonItems/table/columns";
import { DataTable } from "~/components/LessonItems/table/DataTable";

export default function ListItemsLayout() {
  const { lessonItems, setLessonItems } = useLessonItems();

  const dataWithOptions: DataWithOptions[] = lessonItems.map((item) => ({
    ...item,
    options: (
      <TableOptionButtons
        setDataFetch={setLessonItems}
        data={{
          id: item.id,
          title: item.title,
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
