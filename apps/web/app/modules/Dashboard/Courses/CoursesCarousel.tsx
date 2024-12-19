import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import CourseCard from "~/modules/Dashboard/Courses/CourseCard";

import type { GetAllCoursesResponse } from "~/api/generated-api";

type CoursesCarouselProps = {
  courses?: GetAllCoursesResponse["data"];
};

export const CoursesCarousel = ({ courses }: CoursesCarouselProps) => {
  const renderCarouselItems = () => {
    if (!courses?.length) return null;

    return courses.map((course) => {
      if (!course) return null;

      return (
        <CarouselItem
          key={course.id}
          className="max-w-[calc(100%-24px)] xs:max-w-[320px] *:h-full w-full shrink-0 mr-3 sm:mr-6 sm:last:mr-0"
        >
          <CourseCard {...course} />
        </CarouselItem>
      );
    });
  };

  const carouselItems = renderCarouselItems();

  return (
    <Carousel className="w-full" opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="flex lg:bg-white w-full rounded-lg">
        {carouselItems}
      </CarouselContent>
      <div className="lg:absolute lg:-right-8 lg:-top-[96px] sr-only lg:not-sr-only">
        <CarouselPrevious className="rounded-full" />
        <CarouselNext className="rounded-full" />
      </div>
    </Carousel>
  );
};
