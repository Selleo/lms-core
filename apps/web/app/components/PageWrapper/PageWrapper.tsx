import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";

import type { HTMLAttributes, ReactNode } from "react";

type PageWrapperProps = HTMLAttributes<HTMLDivElement> & {
  breadcrumbs?: { title: string; href: string }[];
  children: ReactNode;
  className?: string;
};

type Breadcrumb = { title: string; href: string };

type BreadcrumbsProps = {
  breadcrumbs?: Breadcrumb[];
};

export const Breadcrumbs = ({ breadcrumbs = [] }: BreadcrumbsProps) => {
  if (!breadcrumbs.length) return null;

  return (
    <BreadcrumbList>
      {breadcrumbs.map(({ href, title }, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  );
};

export const PageWrapper = ({ className, breadcrumbs, children, ...props }: PageWrapperProps) => {
  const hasBreadcrumbs = Boolean(breadcrumbs);

  const classes = cn(
    "w-full pt-6 px-4 pb-4 md:px-6 md:pb-6 3xl:pt-12 3xl:px-8 3xl:pb-8",
    { "pt-8 md:pt-6 3xl:pb-2": hasBreadcrumbs },
    className,
  );

  return (
    <div className={classes} {...props}>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      {children}
    </div>
  );
};
