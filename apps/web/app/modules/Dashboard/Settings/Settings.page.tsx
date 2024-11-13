import { useUserRole } from "~/hooks/useUserRole";

import ChangePasswordForm from "./forms/ChangePasswordForm";
import UserDetailsForm from "./forms/UserDetailsForm";
import UserForm from "./forms/UserForm";

export default function SettingsPage() {
  const { isTutor, isAdmin } = useUserRole();

  return (
    <div className="grid gap-6">
      <UserForm />
      {(isTutor || isAdmin) && <UserDetailsForm />}
      <ChangePasswordForm />
    </div>
  );
}
