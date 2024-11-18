import { useState } from "react";

import { Gravatar } from "~/components/Gravatar";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Skeleton } from "~/components/ui/skeleton";

import type { CurrentUserResponse, GetUserStatisticsResponse } from "~/api/generated-api";

type ProfileWithCalendar = {
  user: CurrentUserResponse["data"] | undefined;
  isLoading: boolean;
  streakStatistics: GetUserStatisticsResponse["data"]["streak"];
};

export const ProfileWithCalendar = ({ user, isLoading = true }: ProfileWithCalendar) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  if (isLoading) {
    return (
      <div className="w-full lg:divide-neutral-100 lg:divide-y h-full lg:max-w-[384px] lg:flex-col md:flex-row lg:bg-white rounded-lg drop-shadow-card lg:p-8 flex flex-col gap-6">
        <div className="w-full bg-white rounded-lg p-8 lg:p-0 md:max-w-[352px]">
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
                <Skeleton className="w-40 h-[16px] rounded-lg" />
              </div>
            </div>
            <Skeleton className="w-full mt-6 h-[38px] rounded-lg" />
          </div>
        </div>
        <div className="flex bg-white rounded-lg p-8 lg:p-0 flex-col gap-y-2 w-full h-full max-w-[352px]">
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
    <div className="w-full lg:divide-primary-200 lg:divide-y md:max-w-[352px] h-full lg:max-w-[384px] lg:flex-col md:flex-row lg:bg-white rounded-lg drop-shadow-card lg:p-8 flex flex-col lg:gap-8 gap-6">
      <div className="bg-white rounded-lg w-full">
        <span className="body-lg-md text-neutral-900">My Profile</span>
        <div className="flex flex-col items-center gap-6 mt-6">
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
          <Button className="w-full">Settings</Button>
        </div>
      </div>
      <div className="flex flex-col lg:pt-8 gap-y-2 bg-white rounded-lg">
        <div className="flex flex-row-reverse lg:flex-row justify-between items-center">
          <div className="flex items-center py-2 gap-x-2">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.55828 31.6179C8.46036 25.4497 15.7529 18.9945 16.9289 12.842C17.7601 8.49325 17.1409 3.70398 14.5599 0C18.8265 2.22715 25.3238 5.56069 30.1885 14.3404C35.5409 24.0007 34.1354 29.5151 33.6626 31.0539C35.262 29.0894 37.7272 26.3971 37.8884 24.0002C42.9408 31.0521 41.5501 44.1999 30.1836 47.718C32.7138 44.9615 32.6582 42.3131 30.0273 39.5256C30.061 41.6567 29.8176 42.5574 28.81 44.4074C27.9452 45.9947 26.9044 47.0274 25.3624 48C26.3382 37.2509 19.9535 36.6873 19.7654 31.8985C19.5777 27.1097 21.4555 25.9831 21.4555 25.9831C21.4555 25.9831 14.2249 29.4581 13.6255 35.8135C13.0134 42.3024 18.0869 46.9646 18.5418 47.353C17.2491 47.3328 5.53947 45.4244 7.55828 31.6179Z"
                fill="#F19800"
              />
              <path
                d="M10.8896 34.4113C11.6071 29.2767 15.0762 26.575 17.8781 22.263C20.1933 18.7 22.6553 14.4433 20.6019 11.3599C23.9956 13.2134 28.092 18.2007 29.8625 23.118C32.9594 31.7208 31.3272 34.8774 30.9514 36.1593C32.2235 34.524 37.1564 30.6718 37.2844 28.6768C41.2336 35.0193 40.1972 44.2763 31.1557 47.2048C33.1682 44.9108 33.1305 40.5063 29.6582 38.8674C29.6852 40.6415 28.9775 42.8583 28.5007 44.4258C28.0647 45.86 27.344 46.4671 26.1172 47.2771C26.8936 38.329 21.2961 36.013 21.1466 32.027C20.9975 28.0406 22.5085 25.0429 22.5085 25.0429C22.5085 25.0429 14.8167 26.8246 13.4521 36.017C12.3628 43.3572 17.7201 46.8115 18.0824 47.1343C17.0537 47.1168 9.28386 45.904 10.8896 34.4113Z"
                fill="#F6B63E"
              />
              <path
                d="M32.28 46.3961C33.9585 45.5227 35.4663 44.1496 36.6095 42.6274C37.755 41.1021 38.1905 39.064 38.4146 37.1996C38.6094 35.5841 38.4065 34.0825 37.9925 32.5608C37.9974 32.9474 38.1034 33.3641 38.1254 33.7637C38.1519 34.2473 38.0446 34.7035 37.9417 35.1714C37.7141 36.2046 37.1744 37.4879 36.0128 38.65C33.764 40.8991 32.5176 40.165 32.386 40.3051C32.1979 40.5062 33.2311 41.7033 33.2311 43.2278C33.2311 45.2704 32.8256 45.7405 32.3155 46.6789L32.28 46.3961Z"
                fill="#FDD441"
              />
              <path
                d="M27.2093 44.2829C27.2093 42.0711 26.1043 40.0805 25.0616 38.192C24.3037 36.8189 23.7572 35.3254 23.451 33.7799C22.9916 31.4625 23.5731 29.3319 24.2507 27.1267C24.3603 26.772 24.4424 26.38 24.6068 26.0518C24.6184 26.7549 24.3513 27.5879 24.2431 28.2888C24.1286 29.0351 24.1793 29.8042 24.2947 30.5505C24.5376 32.1162 25.0958 33.4391 25.9139 34.7834C26.3508 35.5014 26.7558 36.1736 27.0337 36.9666C27.3256 37.7995 27.4127 38.6495 27.4482 39.5287C27.4958 40.7083 27.4289 41.865 27.3072 43.0248C27.2515 43.5573 27.1473 44.102 27.0688 44.6345"
                fill="#FDD441"
              />
            </svg>
            <span className="h1 text-neutral-950">19</span>
          </div>
          <span className="text-neutral-800 body-lg-md">Daily Streak</span>
        </div>
        <div className="flex justify-center w-full">
          <Calendar
            mode="single"
            onSelect={setDate}
            showOutsideDays
            fixedWeeks
            weekStartsOn={1}
            // dates={[streakStatistics[0]]}
          />
        </div>
      </div>
    </div>
  );
};
