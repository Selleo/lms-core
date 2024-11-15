import { isEmpty } from "lodash-es";
import { useReducer } from "react";
import { match } from "ts-pattern";

import { useAvailableCourses } from "~/api/queries/useAvailableCourses";
import { categoriesQueryOptions, useCategoriesSuspense } from "~/api/queries/useCategories";
import { allCoursesQueryOptions, useCourses } from "~/api/queries/useCourses";
import { useStudentCourses } from "~/api/queries/useStudentCourses";
import { queryClient } from "~/api/queryClient";
import { ButtonGroup } from "~/components/ButtonGroup/ButtonGroup";
import { Icon } from "~/components/Icon";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import { SORT_OPTIONS, type SortOption } from "~/types/sorting";

import { useLayoutsStore } from "../common/Layout/LayoutsStore";
import Loader from "../common/Loader/Loader";
import {
  type FilterConfig,
  type FilterValue,
  SearchFilter,
} from "../common/SearchFilter/SearchFilter";
import { DashboardIcon, HamburgerIcon } from "../icons/icons";

import { CourseList } from "./Courses/CourseList";
import { StudentCoursesCarousel } from "./Courses/StudentCoursesCarousel";

import type { MetaFunction } from "@remix-run/node";

type State = {
  searchTitle: string | undefined;
  sort: SortOption | undefined | "";
  category: string | undefined;
};

type Action =
  | { type: "SET_SEARCH_TITLE"; payload: string | undefined }
  | { type: "SET_SORT"; payload: string | undefined }
  | { type: "SET_CATEGORY"; payload: string | undefined };

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }, { name: "description", content: "Welcome to Dashboard!" }];
};

export const clientLoader = async () => {
  await queryClient.prefetchQuery(allCoursesQueryOptions());
  await queryClient.prefetchQuery(categoriesQueryOptions());
  return null;
};

function reducer(state: State, action: Action): State {
  return match<Action, State>(action)
    .with({ type: "SET_SEARCH_TITLE" }, ({ payload }) => ({
      ...state,
      searchTitle: payload,
    }))
    .with({ type: "SET_SORT" }, ({ payload }) => ({
      ...state,
      sort: payload as SortOption,
    }))
    .with({ type: "SET_CATEGORY" }, ({ payload }) => ({
      ...state,
      category: payload === "all" ? undefined : payload,
    }))
    .exhaustive();
}

export default function DashboardPage() {
  const { isAdmin } = useUserRole();
  const [state, dispatch] = useReducer(reducer, {
    searchTitle: undefined,
    sort: undefined,
    category: undefined,
  });

  const { data: studentCourses, isLoading: isStudentCoursesLoading } = useStudentCourses();

  const { data: userAvailableCourses, isLoading: isAvailableCoursesLoading } = useAvailableCourses({
    title: state.searchTitle,
    category: state.category,
    sort: state.sort,
  });

  const { data: allCourses, isLoading: isAllCoursesLoading } = useCourses({
    title: state.searchTitle,
    category: state.category,
    sort: state.sort,
  });

  const availableCourses = match(isAdmin)
    .with(true, () => allCourses ?? [])
    .with(false, () => userAvailableCourses ?? [])
    .exhaustive();

  const isCoursesLoading = match(isAdmin)
    .with(true, () => isAllCoursesLoading)
    .with(false, () => isAvailableCoursesLoading)
    .exhaustive();

  const { data: categories, isLoading: isCategoriesLoading } = useCategoriesSuspense();

  const { courseListLayout, setCourseListLayout } = useLayoutsStore();

  const filterConfig: FilterConfig[] = [
    {
      name: "title",
      type: "text",
      placeholder: "Search by title...",
    },
    {
      name: "category",
      type: "select",
      placeholder: "Categories",
      options: categories?.map(({ title }) => ({
        value: title,
        label: title,
      })),
    },
    {
      name: "sort",
      type: "select",
      placeholder: "Sort",
      options: SORT_OPTIONS,
    },
  ];

  const handleFilterChange = (name: string, value: FilterValue) => {
    switch (name) {
      case "title":
        dispatch({ type: "SET_SEARCH_TITLE", payload: value as string });
        break;
      case "category":
        dispatch({ type: "SET_CATEGORY", payload: value as string });
        break;
      case "sort":
        dispatch({ type: "SET_SORT", payload: value as string });
        break;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-y-12 h-auto">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col px-6">
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">Your Courses</h4>
          <p className="text-lg leading-7 text-neutral-800">
            Courses you are currently enrolled in
          </p>
        </div>
        <div
          data-testid="enrolled-courses"
          className="flex lg:p-8 pl-6 gap-6 lg:bg-white w-full lg:rounded-lg drop-shadow-primary"
        >
          {!studentCourses ||
            (isEmpty(studentCourses) && (
              <div className="col-span-3 flex gap-8 ">
                <div>
                  <Icon name="EmptyCourse" className="mr-2 text-neutral-900" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <p className="text-lg font-bold leading-5 text-neutral-950">
                    We could not find any courses
                  </p>
                  <p className="text-neutral-800 text-base leading-6 font-normal">
                    Please change the search criteria or try again later
                  </p>
                </div>
              </div>
            ))}
          {isStudentCoursesLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          )}
          <StudentCoursesCarousel studentCourses={studentCourses} />
        </div>
      </div>
      <div className="flex flex-col px-6 lg:px-0">
        <div className="flex flex-col lg:p-0">
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">Available Courses</h4>
          <p className="text-lg leading-7 text-neutral-800">
            All available career courses available to enroll
          </p>
          <div className="flex justify-between gap-2 items-center">
            <SearchFilter
              filters={filterConfig}
              values={{
                title: state.searchTitle,
                category: state.category,
                sort: state.sort,
              }}
              onChange={handleFilterChange}
              isLoading={isCategoriesLoading}
            />
            <ButtonGroup
              className="sr-only lg:not-sr-only"
              buttons={[
                {
                  children: <DashboardIcon />,
                  isActive: courseListLayout === "card",
                  onClick: () => setCourseListLayout("card"),
                },
                {
                  children: <HamburgerIcon />,
                  isActive: courseListLayout === "table",
                  onClick: () => setCourseListLayout("table"),
                },
              ]}
            />
          </div>
        </div>
        <div
          data-testid="unenrolled-courses"
          className={cn("lg:p-8 gap-6 rounded-lg drop-shadow-primary lg:bg-white", {
            "flex flex-wrap": courseListLayout === "card",
            block: courseListLayout === "table",
          })}
        >
          {availableCourses && !isEmpty(availableCourses) && (
            <CourseList availableCourses={availableCourses} courseListLayout={courseListLayout} />
          )}
          {!availableCourses ||
            (isEmpty(availableCourses) && (
              <div className="col-span-3 flex gap-8 ">
                <div>
                  <Icon name="EmptyCourse" className="mr-2 text-neutral-900" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <p className="text-lg font-bold leading-5 text-neutral-950">
                    We could not find any courses
                  </p>
                  <p className="text-neutral-800 text-base leading-6 font-normal">
                    Please change the search criteria or try again later
                  </p>
                </div>
              </div>
            ))}
          {isCoursesLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
