import { useCurrentUserSuspense } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

export const UserProfile = () => {
  const {
    data: { firstName, lastName, email },
  } = useCurrentUserSuspense();

  return (
    <div className="mt-auto flex w-full max-w-[268px] items-center justify-between rounded-md bg-primary-50 p-[18px]">
      <div className="flex min-w-0 gap-x-2">
        <Avatar>
          <Gravatar email={email} />
          <AvatarFallback>
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
        <hgroup className="subtle flex min-w-0 flex-col">
          <h2 className="text-neutral-900">
            {firstName} {lastName}
          </h2>
          <p className="min-w-0 truncate text-neutral-500">{email}</p>
        </hgroup>
      </div>
    </div>
  );
};
