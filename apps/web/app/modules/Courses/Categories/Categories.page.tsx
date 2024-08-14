import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

const CategoriesButton = () => <Button>Create new</Button>;

export default function CategoriesPage() {
  return (
    <PageWrapper header="Categories" PageWrapperButton={CategoriesButton}>
      <></>
    </PageWrapper>
  );
}
