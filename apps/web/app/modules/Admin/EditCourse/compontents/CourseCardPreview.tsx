import DefaultCoursePhoto from "~/assets/svgs/default-photo-course.svg";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { UserProfile } from "~/components/UserProfile/UserProfile";

type CourseCardPreviewProps = {
  imageUrl?: string;
  title?: string;
  category?: string;
  description?: string;
};

const CourseCardPreview = ({ imageUrl, title, description, category }: CourseCardPreviewProps) => {
  return (
    <Card className="p-6 shadow-md border border-gray-200 w-3/10">
      <CardHeader className="relative flex flex-col !gap-y-1">
        <h5 className="h5 text-neutral-950">Card Preview</h5>
        <p className="text-neutral-800 body-lg-md">
          This is how your Course will be visible to students.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Card className="mt-4 w-full max-w-xs rounded-lg shadow-md relative">
            <CardHeader className="p-0 rounded-t-lg overflow-hidden">
              <img
                src={imageUrl || DefaultCoursePhoto}
                alt="header"
                className="w-full h-60 object-cover"
              />
              {category && (
                <div className="absolute top-3 left-3 bg-white text-black px-4 py-2 rounded-lg text-sm shadow-md flex items-center space-x-2">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <span>{category}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-col justify-between p-3">
              <h1 className="font-bold text-left break-words">{title || "Untitled"}</h1>
              <UserProfile />
              <div
                className="description text-left break-words line-clamp-3 text-gray-500"
                dangerouslySetInnerHTML={{ __html: description || "No description yet." }}
              />
              <div className="flex justify-center w-full mt-5">
                <Button className="mt-4 mx-auto w-3/4 cursor-default">Enroll</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCardPreview;
