import { useUserRole } from "~/hooks/useUserRole";

import { AdminStatistics } from "./Admin/AdminStatistics";
import { ClientStatistics } from "./Client/ClientStatistics";

export default function StatisticsPage() {
  const { isAdmin, isTutor } = useUserRole();

  if (isAdmin || isTutor) {
    return <AdminStatistics />;
  }

  return <ClientStatistics />;
}
