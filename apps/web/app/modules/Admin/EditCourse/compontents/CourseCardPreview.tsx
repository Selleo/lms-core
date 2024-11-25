import DefaultCoursePhoto from "~/assets/default-photo-course.svg";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

type CourseCardPreviewProps = {
  imageUrl?: string;
  title?: string;
  category?: string;
  description?: string;
};

const CourseCardPreview = ({ imageUrl, title, description, category }: CourseCardPreviewProps) => {
  return (
    <Card className="p-6 shadow-md border border-gray-200 w-3/10">
      <CardHeader className="relative">
        <h5 className="text-xl font-semibold">Card Preview</h5>
      </CardHeader>
      <CardContent>
        <p>This is how your Course will be visible to students.</p>
        <div className="flex justify-center">
          <Card className="mt-4 w-full max-w-xs rounded-lg shadow-md relative">
            <CardHeader className="p-0 rounded-t-lg overflow-hidden">
              <img
                src={imageUrl || DefaultCoursePhoto}
                alt="header"
                className="w-full h-[15rem] object-cover"
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
              <div
                className="description text-left break-words mt-10 line-clamp-3 text-gray-500"
                dangerouslySetInnerHTML={{ __html: description || "No description yet." }}
              />
              <div className="flex justify-center w-full mt-10">
                <Button className="mt-4 mx-auto w-3/4">Enroll</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCardPreview;
