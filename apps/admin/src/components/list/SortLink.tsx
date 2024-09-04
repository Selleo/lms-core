import React, { memo, useMemo } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Icon, cssClass } from "@adminjs/design-system";
import { BasePropertyJSON } from "adminjs";

export type SortLinkProps = {
  property: BasePropertyJSON;
  direction?: "asc" | "desc";
  sortBy?: string;
  text: string | React.ReactNode;
};

export const SortLink: React.FC<SortLinkProps> = (props) => {
  const { property, direction = "asc", sortBy, text = "" } = props;
  const { propertyPath } = property;

  const location = useLocation();
  const isActive = useMemo(() => sortBy === propertyPath, [sortBy, property]);

  const query = new URLSearchParams(location.search);
  const oppositeDirection = isActive && direction === "asc" ? "desc" : "asc";
  const sortedByIcon = direction === "asc" ? "ChevronUp" : "ChevronDown";

  query.set("direction", oppositeDirection);
  query.set("sortBy", propertyPath);

  return (
    <NavLink to={{ search: query.toString() }} className={cssClass("SortLink")}>
      <div className="flex items-center">
        <span>{text}</span>
        <span className="w-6 text-center">
          {isActive && <Icon icon={sortedByIcon} color="grey40" ml="lg" />}
        </span>
      </div>
    </NavLink>
  );
};

const checkSortProps = (
  prevProps: Readonly<SortLinkProps>,
  nextProps: Readonly<SortLinkProps>,
) =>
  prevProps.direction === nextProps.direction &&
  prevProps.property.propertyPath === nextProps.property.propertyPath &&
  prevProps.sortBy === nextProps.sortBy;

export default memo(SortLink, checkSortProps);
