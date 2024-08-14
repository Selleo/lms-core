import { Link, useParams } from "@remix-run/react";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

const UserEditButton = () => (
  <Link to="/users">
    <Button>Back</Button>
  </Link>
);

export default function UserEdit() {
  const params = useParams();
  return (
    <PageWrapper header="Edit User" PageWrapperButton={UserEditButton}>
      {params.id}
    </PageWrapper>
  );
}
