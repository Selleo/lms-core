import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import CourseCard from "~/modules/Dashboard/Courses/CourseCard";
import type { GetAllCoursesResponse } from "~/api/generated-api";

type StudentCoursesCarouselProps = {
  studentCourses?: GetAllCoursesResponse["data"];
};

export const StudentCoursesCarousel = ({
  studentCourses,
}: StudentCoursesCarouselProps) => {
  const renderCarouselItems = () => {
    return studentCourses?.map((args, index) => {
      if (args.enrolled) {
        const isFirst = index === 0;
        const isLast = index === studentCourses.length - 1;

        return (
          <CarouselItem
            key={args.id}
            className={cn("max-w-[320px] shrink-0 w-full", {
              "ml-0 mr-3": isFirst,
              "ml-3 mr-0": isLast,
              "mx-3": !isFirst && !isLast,
            })}
          >
            <CourseCard {...args} href={`/course/${args.id}`} />
          </CarouselItem>
        );
      }

      return null;
    });
  };

  const carouselItems = renderCarouselItems();

  return (
    <Carousel className="w-full">
      <CarouselContent className="flex bg-white w-full rounded-lg">
        {carouselItems}
      </CarouselContent>
      <div className="absolute -right-8 -top-[96px]">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};
