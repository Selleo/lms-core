import { Link } from "@remix-run/react";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

const CreateUserButton = () => (
  <Link to="/users" target="_blank">
    <Button>Back</Button>
  </Link>
);

export default function UserCreate() {
  return (
    <PageWrapper header="Create User" PageWrapperButton={CreateUserButton}>
      <></>
    </PageWrapper>
  );
}
