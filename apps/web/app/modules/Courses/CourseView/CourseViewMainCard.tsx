import { Dot } from "lucide-react";
import { Button } from "~/components/ui/button";
import UnenrollDialog from "./UnenrollDialog";

type CourseViewMainCardProps = {
  description?: string;
  title?: string;
  imageUrl?: string;
  category?: string;
  lessonCount?: number;
  isEnrolled: boolean;
  setIsEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CourseViewMainCard = ({
  title = "Introduction to Cloud Computing",
  description = "This course provides a foundational understanding of cloud computing concepts, including its architecture, deployment models (public, private, and hybrid), and service models (IaaS, PaaS, SaaS). Students will learn about the benefits and challenges of adopting cloud technology, explore real-world applications, and gain insight into major cloud platforms like AWS, Microsoft Azure, and Google Cloud. Designed for beginners, this course is perfect for those looking to understand the basics of cloud infrastructure and how it can drive business innovation and efficiency.",
  imageUrl = "https://placehold.co/600x400",
  category = "Information technology",
  isEnrolled,
  setIsEnrolled,
}: CourseViewMainCardProps) => {
  return (
    <div className="md:w-1/3 flex flex-col rounded-2xl bg-white drop-shadow-xl relative">
      <div className="absolute top-0 left-0 bg-white px-2 py-1 rounded-lg translate-x-4 translate-y-4 flex">
        <Dot className="fill-blue-700" />
        <span>{category}</span>
      </div>
      <img
        src={imageUrl}
        alt="Course"
        className="w-full h-1/3 object-cover rounded-2xl"
      />
      <div className="flex flex-col h-full bg-white p-8 rounded-b-2xl min-h-0">
        <div className="gap-2 flex flex-col">
          <p className="text-neutral-600 text-xs">Course progress: 2/10</p>
          <div className="flex justify-between items-center gap-px">
            {Array.from({ length: 2 }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] w-[40px] bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] w-[40px] bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-6">{title}</h2>
        <div className="min-h-0 overflow-auto">
          <p className="mt-4 text-gray-600">{description}</p>
        </div>
        <div className="mt-auto">
          <Button
            onClick={() => setIsEnrolled(true)}
            className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg"
          >
            {isEnrolled ? "Continue" : "Enroll"}
          </Button>
          {isEnrolled && (
            <Button
              className="bg-white border border-neutral-500 text-neutral-900 w-full mt-2"
              onClick={() => setIsEnrolled(false)}
            >
              Unenroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
