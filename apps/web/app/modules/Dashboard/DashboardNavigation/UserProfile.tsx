import { useCurrentUserSuspense } from "~/api/queries";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export const UserProfile = () => {
  const {
    data: { firstName, lastName, email },
  } = useCurrentUserSuspense();

  return (
    <div className="p-[18px] max-w-[268px] bg-primary-50 rounded-md w-full flex items-center justify-between mt-auto">
      <div className="flex gap-x-2 min-w-0">
        <Avatar>
          <AvatarImage src="https://ui-avatars.com/api/?name=User" />
          <AvatarFallback>
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
        <hgroup className="flex flex-col subtle min-w-0">
          <h2 className="text-neutral-900">
            {firstName} {lastName}
          </h2>
          <p className="text-neutral-500 truncate min-w-0">{email}</p>
        </hgroup>
      </div>
    </div>
  );
};
