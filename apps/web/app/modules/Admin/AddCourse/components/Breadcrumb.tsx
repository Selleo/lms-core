import { useNavigate } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";

const Breadcrumb = () => {
  const navigate = useNavigate();

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink className="text-primary-800 body-base-md cursor-pointer">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/courses")}
            className="w-min mr-2"
          >
            <Icon name="ChevronLeft" className="w-3 h-3 mr-2" />
            Back
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink className="text-neutral-850 body-base-md hover:text-neutral-850">
          My courses
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="text-neutral-950 body-base-md">Create new</BreadcrumbItem>
    </BreadcrumbList>
  );
};

export default Breadcrumb;
