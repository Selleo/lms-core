import { Icon } from "~/components/Icon";
import { Card } from "~/components/ui/card";

import { ContentTypes } from "../../../EditCourse.types";

type SelectLessonTypeProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

const SelectLessonType = ({ setContentTypeToDisplay }: SelectLessonTypeProps) => {
  return (
    <div className="w-full max-w-full">
      <Card className="w-full max-w-full p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-4 shadow-sm hover:shadow-md transition rounded-md border cursor-pointer"
            onClick={() => setContentTypeToDisplay(ContentTypes.ADD_TEXT_LESSON)}
          >
            <Icon name="Text" className="mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Text</h3>
            <p className="text-sm text-gray-600 mt-2">
              This type allows you to create text-based content via a rich text editor.
            </p>
          </Card>

          <Card className="p-4 shadow-sm hover:shadow-md transition rounded-md border cursor-pointer">
            <Icon name="Video" className="mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Video</h3>
            <p className="text-sm text-gray-600 mt-2">
              Choose this type if you want to embed video content files like MP4.
            </p>
          </Card>

          <Card className="p-4 shadow-sm hover:shadow-md transition rounded-md border cursor-pointer">
            <Icon name="Presentation" className="mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Presentation</h3>
            <p className="text-sm text-gray-600 mt-2">
              Choose this type if you want to embed presentations files like PPTX.
            </p>
          </Card>

          <Card className="p-4 shadow-sm hover:shadow-md transition rounded-md border cursor-pointer">
            <Icon name="Quiz" className="mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Quiz</h3>
            <p className="text-sm text-gray-600 mt-2">
              This type allows you to build quizzes for your chapter using different types of
              questions.
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default SelectLessonType;
