//TODO: ApiClient does not hav a authControllerCurrentLesson
export const ApiClientTemporaryReturn = {
  data: {
    data: {
      id: "mock-id",
      name: "Mock Lesson Name",
      displayName: "Mock Display Name",
      description: "This is a mock description for the lesson.",
    },
  },
};

const ApiClientMock = {
  auth: {
    authControllerCurrentLesson: () => {
      return ApiClientTemporaryReturn;
    },
  },
};

export const currentLessonItemsQueryOptions = {
  queryKey: ["lessonItems"],
  queryFn: async () => {
    try {
      const response = await ApiClientMock.auth.authControllerCurrentLesson();
      return response.data;
    } catch (error) {
      console.error("Error fetching lesson items:", error);
      throw error;
    }
  },
};
