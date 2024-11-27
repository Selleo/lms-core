import { useCurrentUser } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { PageWrapper } from "~/components/PageWrapper";
import { Avatar } from "~/components/ui/avatar";

export const AdminStatistics = () => {
  const { data: user } = useCurrentUser();

  return (
    <PageWrapper className="flex flex-col gap-y-6 xl:gap-y-8 h-auto">
      <div className="gap-x-2 flex xl:gap-x-4 items-center">
        <p className="h5 xl:h2 text-neutral-950">Welcome back, {user?.firstName}</p>
        <Avatar className="size-12">
          <Gravatar email={user?.email} />
        </Avatar>
      </div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-y-6 md:gap-x-4 xl:grid-cols-4">
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 w-full h-[624px] xl:h-[447px]"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-1 xl:col-span-1 w-full h-[400px] xl:h-[447px]"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-1 xl:col-span-1 w-full h-[400px] xl:h-[447px]"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 w-full h-[447px] xl:h-[447px]"></div>
        <div className="p-6 bg-white rounded-lg drop-shadow-card md:col-span-2 xl:col-span-2 w-full h-[400px] xl:h-[447px]"></div>
      </div>
    </PageWrapper>
  );
};
