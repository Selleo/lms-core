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
            className="max-w-[320px] shrink-0 w-full mr-6 last:mr-0"
          >
            <CourseCard
              {...studentCourse}
              href={`/course/${studentCourse.id}`}
            />
          </CarouselItem>
        );
      }
    });
  };

  const carouselItems = renderCarouselItems();

  return (
    <Carousel className="w-full" opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="flex bg-white w-full rounded-lg">
        {carouselItems}
      </CarouselContent>
      <div className="absolute -right-8 -top-[96px]">
        <CarouselPrevious className="rounded-full" />
        <CarouselNext className="rounded-full" />
      </div>
    </Carousel>
  );
};
