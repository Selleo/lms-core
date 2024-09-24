import type { MetaFunction } from "@remix-run/node";
import { isEmpty } from "lodash-es";
import { useReducer } from "react";
import { match } from "ts-pattern";
import {
  categoriesQueryOptions,
  useCategoriesSuspense,
} from "~/api/queries/useCategories";
import { coursesQueryOptions, useCourses } from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";
import { SortOption } from "~/types/sorting";
import Loader from "../common/Loader/Loader";
import SearchFilter from "../common/SearchFilter/SearchFilter";
import CourseCard from "./Courses/CourseCard";

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

  const { data: courses, isLoading: isCoursesLoading } = useCourses({
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
    <div className="flex flex-1 flex-col h-full">
      <div className="flex flex-col">
        <h1 className="h3 text-neutral-950">Available Courses</h1>
        <p className="text-body-lg text-neutral-700">
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
      <div className="grid p-6 gap-1 gap-x-6 grid-cols-[repeat(auto-fit,minmax(360px,1fr))] bg-white">
        {!courses ||
          (isEmpty(courses) && (
            <div className="flex justify-center items-center h-full">
              <h2 className="text-center text-2xl font-bold text-neutral-950">
                No courses found
              </h2>
            </div>
          ))}
        {isCoursesLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        )}
        {courses &&
          courses.map(({ title, category, courseLessonCount, id, imageUrl }) => (
            <CourseCard
              key={id}
              title={title}
              imageUrl={imageUrl}
              href={`/course/${id}`}
              category={category}
              courseLessonCount={courseLessonCount}
            />
          ))}
      </div>
    </div>
  );
}
