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

type CoursesCarouselProps = {
  courses?: GetAllCoursesResponse["data"];
  buttonContainerClasses?: string;
};

export const CoursesCarousel = ({
  courses,
  buttonContainerClasses = "lg:right-0",
}: CoursesCarouselProps) => {
  const renderCarouselItems = () => {
    if (!courses?.length) return null;

    return courses.map((course) => {
      if (!course) return null;

      return (
        <CarouselItem
          key={course.id}
          className="xs:max-w-[320px] mr-3 w-full max-w-[calc(100%-24px)] shrink-0 *:h-full sm:mr-6 sm:last:mr-0"
        >
          <CourseCard {...course} />
        </CarouselItem>
      );
    });
  };

  const carouselItems = renderCarouselItems();

  const buttonContainerStyle = cn(
    "lg:absolute lg:-top-[96px] lg:flex lg:gap-x-2 sr-only lg:not-sr-only",
    buttonContainerClasses,
  );

  return (
    <Carousel className="w-full" opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="flex w-full rounded-lg lg:bg-white">
        {carouselItems}
      </CarouselContent>
      <div className={buttonContainerStyle}>
        <CarouselPrevious className="rounded-full" />
        <CarouselNext className="rounded-full" />
      </div>
    </Carousel>
  );
};
