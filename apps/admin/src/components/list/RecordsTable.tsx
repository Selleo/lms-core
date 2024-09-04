import React from "react";
import {
  TableData,
  TableButtons,
  OptionButtonsProps,
  ColumnDef,
} from "@repo/ui";
import { Pencil, Eye, ArchiveRestore, ArchiveX } from "lucide-react";
import { SortLink } from "./SortLink.js";
import StatusListValue from "../custom/StatusListValue.js";
import { BasePropertyJSON, RecordsTableProps } from "adminjs";

type ArchiveAction = {
  recordId: string;
  currentArchivedStatus: boolean;
  href: string;
};
type ComponentsListType = {
  [value: string]: React.ComponentType<any>;
};

const toggleArchive = async (
  recordId: ArchiveAction["recordId"],
  currentArchivedStatus: ArchiveAction["currentArchivedStatus"],
  href: ArchiveAction["href"],
) => {
  const newArchivedStatus = !currentArchivedStatus;

  const apiUrl = `/api${href}/records/${recordId}/edit`;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      archived: newArchivedStatus,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.notice && data.notice.type === "success") {
      } else {
        console.error(
          "Failed to update the archived status:",
          data.notice.message,
        );
      }
    })
    .catch((error) => {
      console.error("Error while updating the archived status:", error);
    });
  window.location.reload();
};

const actionButtons = [
  { action: "show", Icon: Eye },
  { action: "edit", Icon: Pencil },
  {
    action: "archive",
    Icon: ArchiveX,
    SecondIcon: ArchiveRestore,
    archiveAction: function (
      recordId: ArchiveAction["recordId"],
      currentArchivedStatus: ArchiveAction["currentArchivedStatus"],
      href: ArchiveAction["href"],
    ) {
      toggleArchive(recordId, currentArchivedStatus, href);
    },
  },
];

const componentsList: ComponentsListType = {
  StatusListValue,
};

const Buttons: React.FC<OptionButtonsProps> = ({
  id,
  archived,
  href,
}: OptionButtonsProps) => (
  <TableButtons
    archived={archived}
    actionButtos={actionButtons}
    id={id}
    href={href}
  />
);

export const generateColumns = (columnDefinitions: BasePropertyJSON[]) => {
  return columnDefinitions.map((col) => {
    const { label, name, custom, components } = col;

    const column: ColumnDef<any> = {
      accessorKey: custom?.name || name,
      header: custom?.label || label,
    };
    if (components?.list) {
      const GenerateComponent = componentsList[components.list];
      if (GenerateComponent) {
        column.cell = ({ row }) => {
          return (
            <GenerateComponent value={row.original[custom?.originalValue]} />
          );
        };
      } else {
        console.error(
          `Component ${components.list} not found in componentsList.`,
        );
      }
    }

    return column;
  });
};

const RecordsTable: React.FC<RecordsTableProps> = (props) => {
  const { records, resource, direction, sortBy } = props;
  const { listProperties, href } = resource;
  const data = records.map((record) => record.params);
  const columns = generateColumns(listProperties);
  return (
    <div>
      <TableData
        SortLink={({ property, text }) => (
          <SortLink
            text={text}
            property={property}
            sortBy={sortBy}
            direction={direction}
          />
        )}
        href={href}
        listProperties={listProperties}
        Buttons={Buttons}
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default RecordsTable;
