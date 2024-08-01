import ChangePasswordForm from "./forms/ChangePasswordForm";
import UserForm from "./forms/UserForm";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <UserForm />
      <ChangePasswordForm />
    </div>
  );
}
