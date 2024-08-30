import { NavLink } from "react-router-dom";

interface SubMenuProps {
  children: {
    id: string | number;
    name: string;
    href: string;
  }[];
}

export const SubMenu = ({ children }: SubMenuProps) => (
  <ol className="pl-6 bg-gray-100">
    {children.map((child) => (
      <li key={child.id}>
        <NavLink
          to={child.href}
          className="no-underline w-full flex items-center pl-2 transition-colors duration-300 py-2 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
        >
          <span className="capitalize">{child.name}</span>
        </NavLink>
      </li>
    ))}
  </ol>
);
