import { Outlet } from "@remix-run/react";
import { EditForm } from "../components/EditForm/EditForm";

const EditLessonItemsLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default EditLessonItemsLayout;
