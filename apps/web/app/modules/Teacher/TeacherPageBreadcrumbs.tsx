import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

type TeacherPageBreadcrumbsProps = {
  id: string;
  username: string;
};

export const TeacherPageBreadcrumbs = ({ id, username }: TeacherPageBreadcrumbsProps) => {
  return (
    <div className="bg-primary-50 mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/`}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-neutral-950">
          <BreadcrumbLink href={`/teachers/${id}`}>{username}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </div>
  );
};
