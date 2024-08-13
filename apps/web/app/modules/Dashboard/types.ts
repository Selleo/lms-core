import { LucideProps } from "lucide-react";
import { GetUsersResponse } from "~/api/generated-api";

export type Role = GetUsersResponse["data"][number]["role"];

export interface BaseMenuItem {
  label: string;
  roles: Role[];
}

export interface LeafMenuItem extends BaseMenuItem {
  link: string;
  Icon: React.FC<LucideProps>;
}

export interface ParentMenuItem extends BaseMenuItem {
  children: MenuItemType[];
}

export type MenuItemType = LeafMenuItem | ParentMenuItem;
