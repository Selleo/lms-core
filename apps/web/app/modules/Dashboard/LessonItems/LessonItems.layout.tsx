import { useState } from "react";
import { columns } from "./components/table/columns";
import { DataTable } from "./components/table/DataTable";

import { LessonItemsButton } from "./components/LessonItemsButton.js";
import { TableOptionButtons } from "./components/TableOptionButtons/TableOptionButtons";

interface DataItem {
  id: string;
  name: string;
  displayName: string;
}

interface DataItemWithOptions {
  id: string;
  name: string;
  displayName: string;
  options: JSX.Element;
}

export default function ListItemLayout() {
  const [dataFetch, setDataFetch] = useState<DataItem[]>([
    {
      id: "728ed51f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed52f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed53f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed54f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed55f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed56f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed57f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed58f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed59f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed510f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed511f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed512f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed513f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed514f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed515f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed516f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed517f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed518f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed519f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed520f",
      name: "Testing",
      displayName: "Testing",
    },
    {
      id: "728ed521f",
      name: "Testing",
      displayName: "Testing",
    },
  ]);
  const dataWithOptions: DataItemWithOptions[] = dataFetch.map((item) => ({
    ...item,
    options: (
      <TableOptionButtons
        setDataFetch={setDataFetch}
        data={{
          id: item.id,
          displayName: item.displayName,
          description:
            "Very very very very very very very very very very very very very great course :D",
        }}
      />
    ),
  }));

  return (
    <div>
      <LessonItemsButton />
      <DataTable columns={columns} data={dataWithOptions} />
    </div>
  );
}
