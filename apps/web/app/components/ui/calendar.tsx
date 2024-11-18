import { DayPicker } from "react-day-picker";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import type { ComponentProps } from "react";
import type { DayContentProps } from "react-day-picker";

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  dates: Date[] | undefined;
};

type CustomDayContentProps = DayContentProps & {
  dates: Date[] | undefined;
};

function CustomDayContent({ dates, ...props }: CustomDayContentProps) {
  console.log(props.date);
  if (dates?.includes(props.date)) {
    return <span style={{ position: "relative", overflow: "visible" }}>🎉</span>;
  }

  return <div>{props.date.getDate()}</div>;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  dates,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full", className)}
      classNames={{
        months: "flex flex-col relative",
        month_caption:
          "flex justify-center h-10 w-full border-primary-500 border-b relative items-center",
        weekdays: "flex flex-row gap-1.5 lg:gap-2",
        weekday: "text-muted-foreground w-8 font-normal text-[0.8rem]",
        month:
          "gap-y-4 overflow-x-hidden w-full border border-primary-500 rounded-2xl pt-1.5 pb-4 lg:pb-6 px-2.5 lg:px-6",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "truncate body-lg-md",
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className: "absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        button_previous: cn(
          buttonVariants({
            variant: "outline",
            className: "absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          }),
        ),
        nav: "flex items-start justify-between absolute w-full",
        month_grid: "mt-4 w-full",
        week: "flex w-full mt-3 gap-1.5 lg:gap-2",
        day: "p-0 border border-neutral-300 text-neutral-950 aspect-square size-8 text-sm flex items-center justify-center has-[button]:hover:!bg-success-200 rounded-full has-[button]:hover:aria-selected:!bg-success-500 has-[button]:hover:text-accent-foreground has-[button]:hover:aria-selected:text-primary-foreground",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal transition-none hover:bg-transparent hover:text-inherit aria-selected:opacity-100",
        ),
        range_start: "day-range-start rounded-s-md",
        range_end: "day-range-end rounded-e-md",
        selected:
          "bg-success-500 border-success-500 text-primary-foreground hover:!bg-success-200 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside border-success-200 text-white bg-success-200 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent hover:aria-selected:!bg-accent rounded-none aria-selected:text-accent-foreground hover:aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        DayContent: ({ ...props }) => <CustomDayContent {...props} dates={dates} />,
        PreviousMonthButton: ({ ...props }) => <div className="sr-only" />,
        NextMonthButton: ({ ...props }) => <div className="sr-only" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
