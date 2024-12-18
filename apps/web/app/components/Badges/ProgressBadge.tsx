import { Badge } from "~/components/ui/badge";

import type { IconName } from "~/types/shared";

type ProgressBadgeProps = {
  progress: "completed" | "inProgress" | "notStarted";
  className?: string;
};

type ProgressConfig = {
  [key in "completed" | "inProgress" | "notStarted"]: {
    variant: "successFilled" | "inProgressFilled" | "notStartedFilled";
    icon: IconName;
    label: string;
  };
};

export const ProgressBadge = ({ progress, className }: ProgressBadgeProps) => {
  const progressConfig: ProgressConfig = {
    completed: {
      variant: "successFilled",
      icon: "InputRoundedMarkerSuccess",
      label: "Completed",
    },
    inProgress: {
      variant: "inProgressFilled",
      icon: "InProgress",
      label: "In Progress",
    },
    notStarted: {
      variant: "notStartedFilled",
      icon: "NotStartedRounded",
      label: "Not Started",
    },
  };

  const { variant, icon, label } = progressConfig[progress];

  return (
    <Badge variant={variant} icon={icon} {...(Boolean(className) && { className })}>
      {label}
    </Badge>
  );
};
