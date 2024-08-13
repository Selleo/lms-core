import { isEmpty } from "lodash-es";
import {
  Book,
  BookOpen,
  FileText,
  LayoutDashboard,
  Tag,
  Users,
} from "lucide-react";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { cn } from "~/lib/utils";
import { useAuthorizedMenuItems } from "../hooks/useAuthorizedMenuItems";
import { MenuItemType } from "../types";
import { MenuItem } from "./MenuItem";

const menuItems: MenuItemType[] = [
  {
    label: "dashboard",
    link: "/",
    roles: ["student"],
    Icon: LayoutDashboard,
  },
  {
    label: "Management",
    roles: ["tutor", "admin", "student"],
    children: [
      {
        label: "categories",
        link: "/categories",
        roles: ["tutor", "admin"],
        Icon: Tag,
      },
      {
        label: "courses",
        link: "/courses",
        roles: ["tutor", "admin", "student"],
        Icon: BookOpen,
      },
      {
        label: "lessons",
        link: "/lessons",
        roles: ["tutor", "admin", "student"],
        Icon: Book,
      },
      {
        label: "lesson items",
        link: "/lesson-items",
        roles: ["tutor", "admin"],
        Icon: FileText,
      },
      {
        label: "users",
        link: "/users",
        roles: ["admin"],
        Icon: Users,
      },
    ],
  },
];

export function DashboardNavigation() {
  const {
    data: { role },
  } = useCurrentUserSuspense();
  const authorizedMenuItems = useAuthorizedMenuItems({
    menuItems,
    userRole: role,
  });

  if (isEmpty(authorizedMenuItems)) {
    return null;
  }

  return (
    <div className={cn("w-52 bg-muted/40 overflow-y-auto flex flex-col")}>
      <nav className="flex-grow pt-3">
        <ul className="flex flex-col items-center">
          {authorizedMenuItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
