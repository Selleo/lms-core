import type { GetAllCoursesResponse } from "~/api/generated-api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import CourseCard from "~/modules/Dashboard/Courses/CourseCard";

type StudentCoursesCarouselProps = {
  studentCourses?: GetAllCoursesResponse["data"];
};

export const StudentCoursesCarousel = ({
  studentCourses,
}: StudentCoursesCarouselProps) => {
  const renderCarouselItems = () => {
    if (!studentCourses) return null;

    return studentCourses.map((studentCourse) => {
      if (studentCourse.enrolled) {
        return (
          <CarouselItem
            key={studentCourse.id}
            className="max-w-[calc(100%-24px)] xs:max-w-[320px] w-full shrink-0 mr-3 sm:mr-6 sm:last:mr-0"
          >
            <CourseCard
              {...studentCourse}
              href={`/course/${studentCourse.id}`}
            />
          </CarouselItem>
        );
      }

      return null;
    });
  };

  const carouselItems = renderCarouselItems();

  return (
    <Carousel className="w-full" opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="flex lg:bg-white w-full rounded-lg ">
        {carouselItems}
      </CarouselContent>
      <div className="lg:absolute lg:-right-8 lg:-top-[96px] sr-only">
        <CarouselPrevious className="rounded-full" />
        <CarouselNext className="rounded-full" />
      </div>
    </Carousel>
  );
};
