import { startTransition } from "react";

import { useLogoutUser } from "~/api/mutations/useLogoutUser";
import { Icon } from "~/components/Icon";

export const LogoutButton = () => {
  const { mutate: logout } = useLogoutUser();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          logout();
        });
      }}
      className="flex items-center rounded-md hover:bg-primary-50 subtle font-md gap-x-2 w-full p-2"
    >
      <Icon name="Logout" className="w-4 h-4" />
      <span className="subtle text-neutral-900">Log Out</span>
    </button>
  );
};
