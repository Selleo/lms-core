import React, { useEffect, useState } from "react";
import { NavBar } from "@repo/ui";
import { Tag, Users, BookOpen, Book, FileText } from "lucide-react";

const menuItems = [
  {
    href: "/resources/users",
    id: "users",
    name: "users",
    Icon: Users,
  },
  {
    href: "/resources/categories",
    id: "categories",
    name: "categories",
    Icon: Tag,
  },
  {
    href: "/resources/courses",
    id: "courses",
    name: "courses",
    Icon: BookOpen,
  },
  {
    href: "/resources/lessons",
    id: "lessons",
    name: "lessons",
    Icon: Book,
  },
  {
    href: "/resources/lesson-items",
    id: "lesson-items",
    name: "Lesson Items",
    Icon: FileText,
    // TODO: After setting up the database, the href in children may not work correctly. Review and fix if needed.
    children: [
      {
        id: "videos",
        name: "Video lessons",
        href: "?page=1&filters.type=video",
      },
      {
        id: "texts",
        name: "Text Lessons",
        href: "?page=1&filters.type=text",
      },
      {
        id: "questions",
        name: "Question Lessons",
        href: "?page=1&filters.type=question",
      },
    ],
  },
];

type SidebarProps = {
  isVisible: boolean;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { isVisible } = props;
  const [isNarrowWindow, setIsNarrowWindow] = useState(
    window.innerWidth <= 1323,
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1323) {
        setIsNarrowWindow(true);
      } else {
        setIsNarrowWindow(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NavBar
      isNarrowWindow={isNarrowWindow}
      isVisible={isVisible}
      menuItems={menuItems}
    />
  );
};

export default Sidebar;
