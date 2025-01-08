import { Link } from "@remix-run/react";
import { keys, pickBy } from "lodash-es";

import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Skeleton } from "~/components/ui/skeleton";

import type { CurrentUserResponse, GetUserStatisticsResponse } from "~/api/generated-api";
import { useTranslation } from "react-i18next";

type ProfileWithCalendar = {
  user: CurrentUserResponse["data"] | undefined;
  isLoading: boolean;
  streak?: GetUserStatisticsResponse["data"]["streak"];
};

export const ProfileWithCalendar = ({ user, isLoading = true, streak }: ProfileWithCalendar) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="w-full 2xl:divide-neutral-100 2xl:divide-y h-full 2xl:max-w-[384px] 2xl:flex-col md:flex-row 2xl:bg-white rounded-lg drop-shadow-card 2xl:p-8 flex flex-col gap-6">
        <div className="w-full bg-white rounded-lg p-8 2xl:p-0 md:max-w-[352px]">
          <div className="flex items-center">
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="flex flex-col items-center mt-6">
            <Skeleton className="aspect-square size-[124px] rounded-full" />
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center h-[38px] w-full max-w-[240px]">
                <Skeleton className="h-6 w-full rounded-lg" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-40 h-4 rounded-lg" />
              </div>
            </div>
            <Skeleton className="w-full mt-6 h-[38px] rounded-lg" />
          </div>
        </div>
        <div className="flex bg-white rounded-lg p-8 2xl:p-0 flex-col gap-y-2 w-full h-full max-w-[352px]">
          <div className="flex items-center py-[21px]">
            <Skeleton className="w-full h-8" />
          </div>
          <div className="flex justify-center w-full h-full">
            <Skeleton className="h-[376px] md:h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full 2xl:divide-primary-200 2xl:divide-y 2xl:max-w-[384px] 2xl:flex-col md:flex-row 2xl:bg-white rounded-lg drop-shadow-card 2xl:p-8 flex flex-col 2xl:gap-6 gap-6">
      <div className="bg-white rounded-lg w-full p-6 gap-y-6 md:p-8 2xl:p-0">
        <span className="body-lg-md text-neutral-900">{t('profilWithCalendarView.header')}</span>
        <div className="flex flex-col items-center gap-6">
          <Avatar className="size-[124px]">
            <Gravatar email={user?.email} />
          </Avatar>
          <div className="text-center">
            <h2 className="h5">
              {user?.firstName} {user?.lastName}
            </h2>
            <a className="body-lg text-neutral-800" href={`mailto:${user?.email}`}>
              {user?.email}
            </a>
          </div>
          <Link to="/settings" className="w-full">
            <Button className="w-full">{t('profilWithCalendarView.button.settings')}</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full p-6 2xl:pt-6 gap-y-2 bg-white rounded-lg md:p-8 2xl:p-0">
        <div className="flex flex-row-reverse 2xl:flex-row justify-between items-center">
          <div className="flex items-center py-2 gap-x-2">
            <Icon name="Flame" />
            <span className="h1 text-neutral-950">{streak?.current}</span>
          </div>
          <span className="text-neutral-800 body-lg-md">{t('profilWithCalendarView.other.dailyStreak')}</span>
        </div>
        <div className="flex justify-center w-full">
          <Calendar
            mode="single"
            showOutsideDays
            fixedWeeks
            weekStartsOn={1}
            dates={keys(pickBy(streak?.activityHistory, Boolean))}
          />
        </div>
      </div>
    </div>
  );
};
