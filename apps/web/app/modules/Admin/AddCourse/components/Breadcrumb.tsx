import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            {t("adminCourseView.settings.breadcrumbs.back")}
          </Button>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink className="text-neutral-850 body-base-md hover:text-neutral-850">
          {t("adminCourseView.settings.breadcrumbs.myCourses")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem className="text-neutral-950 body-base-md">
        {t("adminCourseView.settings.breadcrumbs.createNew")}
      </BreadcrumbItem>
    </BreadcrumbList>
  );
};

export default Breadcrumb;
