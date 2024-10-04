import type { MetaFunction } from "@remix-run/node";
import { isEmpty } from "lodash-es";
import { useReducer } from "react";
import { match } from "ts-pattern";
import {
  categoriesQueryOptions,
  useCategoriesSuspense,
} from "~/api/queries/useCategories";
import { coursesQueryOptions } from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";
import type { SortOption } from "~/types/sorting";
import Loader from "../common/Loader/Loader";
import SearchFilter from "../common/SearchFilter/SearchFilter";
import CourseCard from "./Courses/CourseCard";
import { Icon } from "~/components/Icon";
import { useAvailableCourses } from "~/api/queries/useAvailableCourses";
import { StudentCoursesCarousel } from "./Courses/StudentCoursesCarousel";
import { useStudentCourses } from "~/api/queries/useStudentCourses";

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
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export const clientLoader = async () => {
  await queryClient.prefetchQuery(coursesQueryOptions());
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
  const [state, dispatch] = useReducer(reducer, {
    searchTitle: undefined,
    sort: undefined,
    category: undefined,
  });

  const { data: studentCourses, isLoading: isStudentCoursesLoading } =
    useStudentCourses();

  const { data: availableCourses, isLoading: isAvailableCoursesLoading } =
    useAvailableCourses({
      title: state.searchTitle,
      category: state.category,
      sort: state.sort,
    });

  const { data: categories, isLoading: isCategoriesLoading } =
    useCategoriesSuspense();

  const handleSearchTitleChange = (title: string | undefined) => {
    dispatch({ type: "SET_SEARCH_TITLE", payload: title });
  };

  const handleSortChange = (sort: SortOption | undefined) => {
    dispatch({ type: "SET_SORT", payload: sort });
  };

  const handleCategoryChange = (category: string | undefined) => {
    dispatch({ type: "SET_CATEGORY", payload: category ?? undefined });
  };

  return (
    <div className="flex flex-1 flex-col gap-y-12 h-full">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col">
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">
            Your Courses
          </h4>
          <p className="text-lg leading-7 text-neutral-800">
            Courses you are currently enrolled in
          </p>
        </div>
        <div className="flex p-8 gap-6 bg-white w-full rounded-lg drop-shadow-primary">
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
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h4 className="text-neutral-950 text-2xl font-bold leading-10 pb-1">
            Available Courses
          </h4>
          <p className="text-lg leading-7 text-neutral-800">
            All available career courses available to enroll
          </p>
          <SearchFilter
            onSearchTitleChange={handleSearchTitleChange}
            onSortChange={handleSortChange}
            onCategoryChange={handleCategoryChange}
            searchValue={state.searchTitle}
            sortValue={state.sort}
            categoryValue={state.category}
            categories={categories}
            isLoading={isCategoriesLoading}
          />
        </div>
        <div className="grid p-8 gap-6 grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 bg-white rounded-lg drop-shadow-primary">
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
          {isAvailableCoursesLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          )}
          {availableCourses &&
            availableCourses.map(
              ({
                title,
                category,
                description,
                courseLessonCount,
                id,
                imageUrl,
                enrolled,
              }) => {
                if (!enrolled) {
                  return (
                    <CourseCard
                      key={id}
                      title={title}
                      imageUrl={imageUrl}
                      description={description}
                      href={`/course/${id}`}
                      category={category}
                      courseLessonCount={courseLessonCount}
                      enrolled={enrolled}
                    />
                  );
                }

                return null;
              },
            )}
        </div>
      </div>
    </div>
  );
}
