import {
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

//TODO: ApiClient does not hav a authControllerCurrentLesson

const ApiClientTemporary = {
  auth: {
    authControllerCurrentLesson: () => {
      return {
        data: {
          data: {
            id: "xd",
            name: "xd",
            displayName: "xd",
            description: "xd",
          },
        },
      };
    },
  },
};

export const currentLessonItemsQueryOptions = {
  queryKey: ["lessonItems"],
  queryFn: async () => {
    const response =
      await ApiClientTemporary.auth.authControllerCurrentLesson();
    return response.data;
  },
};

export function useCurrentLessonItems() {
  const { data, ...rest } = useQuery(currentLessonItemsQueryOptions);
  return { data: data?.data, ...rest };
}

export function useCurrentLessonItemsSuspense() {
  const { data, ...rest } = useSuspenseQuery(currentLessonItemsQueryOptions);
  return { data: data.data, ...rest };
}
