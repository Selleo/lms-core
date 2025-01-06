import { Link } from "@remix-run/react";

import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import { CategoryChip } from "~/components/ui/CategoryChip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useUserRole } from "~/hooks/useUserRole";

import CourseCardButton from "./CourseCardButton";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";

type CardCourseListProps = {
  availableCourses?: GetAvailableCoursesResponse["data"];
};

export const TableCourseList = ({ availableCourses }: CardCourseListProps) => {
  const { isAdmin } = useUserRole();

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="bg-neutral-50 border-none">
          <TableHead className="w-24 text-sm font-medium text-neutral-950 rounded-s-lg">
            Image
          </TableHead>
          <TableHead className="text-sm font-medium text-neutral-950">Course Name</TableHead>
          <TableHead className="text-sm font-medium text-neutral-950 hidden md:table-cell">
            Category
          </TableHead>
          <TableHead className="text-sm font-medium text-neutral-950 hidden lg:table-cell">
            Description
          </TableHead>
          <TableHead className="w-28 rounded-e-lg"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="before:block before:h-4 before:content-['']">
        {availableCourses?.map(
          ({
            currency,
            id,
            title,
            thumbnailUrl,
            description,
            category,
            enrolled = false,
            priceInCents,
          }) => (
            <TableRow key={id} className="group hover:bg-primary-50 border-none">
              <TableCell className="p-4 rounded-s-lg">
                <img
                  src={thumbnailUrl || "https://placehold.co/600x400/png"}
                  alt={title}
                  loading="eager"
                  decoding="async"
                  className="w-16 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = CardPlaceholder;
                  }}
                />
              </TableCell>
              <TableCell className="p-4 font-medium">{title}</TableCell>
              <TableCell className="p-4 hidden md:table-cell">
                <CategoryChip
                  category={category}
                  className="bg-primary-50 group-hover:bg-white"
                  color="text-primary-950"
                />
              </TableCell>
              <TableCell className="p-4 max-w-xs truncate hidden lg:table-cell">
                {description}
              </TableCell>
              <TableCell className="p-4 rounded-e-lg">
                <Link to={`/course/${id}`} className="block w-full">
                  <CourseCardButton
                    enrolled={enrolled}
                    isAdmin={isAdmin}
                    priceInCents={priceInCents}
                    currency={currency}
                  />
                </Link>
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
};
