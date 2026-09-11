import { Archive, CheckCircle2, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const presentation = {
  active: { variant: "inProgress", icon: Clock3 },
  completed: { variant: "success", icon: CheckCircle2 },
  archived: { variant: "notStarted", icon: Archive },
} as const;

export function ConversationStatus({
  status,
  compact = false,
}: {
  status: keyof typeof presentation;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const { variant, icon: StatusIcon } = presentation[status];
  if (compact)
    return (
      <span
        className={cn("inline-flex items-center gap-1 whitespace-nowrap text-xs", {
          "text-warning-800": status === "active",
          "text-success-700": status === "completed",
          "text-neutral-500": status === "archived",
        })}
      >
        <StatusIcon className="size-3.5" aria-hidden="true" />
        {t(`aiConversations.statuses.${status}`)}
      </span>
    );
  return (
    <Badge variant={variant} className="w-max whitespace-nowrap">
      <StatusIcon className="size-4" aria-hidden="true" />
      {t(`aiConversations.statuses.${status}`)}
    </Badge>
  );
}
