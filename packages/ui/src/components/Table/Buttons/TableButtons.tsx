import { ActionButton } from "./ActionButton.js";

interface IconProperty {
  className?: string;
}

export type IconProps = React.ComponentType<IconProperty>;

type ActionButtonsType = {
  action: string;
  Icon: IconProps;
  SecondIcon?: IconProps;
  archiveAction?: any;
};

export type OptionButtonsProps = {
  id?: string;
  archived?: boolean;
  href?: string;
};

export interface ButtonsProps extends OptionButtonsProps {
  actionButtos: ActionButtonsType[];
}

export const TableButtons: React.FC<ButtonsProps> = ({
  id,
  actionButtos,
  archived,
  href: sourceToTable,
}) => {
  return (
    <div className="flex justify-end gap-3">
      {actionButtos.map(
        ({ action, Icon, archiveAction, SecondIcon }, index) => (
          <ActionButton
            key={`${id}${index}`}
            href={`records/${id}/${action}`}
            Icon={Icon}
            id={id}
            sourceToTable={sourceToTable}
            archived={archived}
            onClick={archiveAction}
            SecondIcon={SecondIcon}
          />
        )
      )}
    </div>
  );
};
