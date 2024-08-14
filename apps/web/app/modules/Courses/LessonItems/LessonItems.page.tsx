import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

const LessonItemsButton = () => <Button>Create a course</Button>;

export default function LessonItemsPage() {
  return (
    <PageWrapper header="Lesson items" PageWrapperButton={LessonItemsButton}>
      <></>
    </PageWrapper>
  );
}
