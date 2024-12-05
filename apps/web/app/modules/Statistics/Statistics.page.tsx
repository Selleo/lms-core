import { useUserRole } from "~/hooks/useUserRole";

import { AdminStatistics } from "./Admin/AdminStatistics";
import ClientStatistics from "./Client/ClientStatistics";

export default function StatisticsPage() {
  const { isAdmin, isTeacher } = useUserRole();

  if (isAdmin || isTeacher) {
    return <AdminStatistics />;
  }

  return <ClientStatistics />;
}
