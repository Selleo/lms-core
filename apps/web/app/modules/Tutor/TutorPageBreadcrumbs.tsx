import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

type TutorPageBreadcrumbsProps = {
  id: string;
  username: string;
};

export const TutorPageBreadcrumbs = ({ id, username }: TutorPageBreadcrumbsProps) => {
  return (
    <div className="bg-primary-50 mb-4 px-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/`}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-neutral-950">
          <BreadcrumbLink href={`/tutors/${id}`}>{username}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </div>
  );
};
