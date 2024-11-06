export const studentCourses = {
  data: [
    {
      id: "1234",
      author: "John Doe",
      category: "Software Development",
      title: "Introduction to Programming",
      courseLessonCount: 5,
      description: "Learn the basics of programming",
      enrolled: true,
      enrolledParticipantCount: 3,
      imageUrl: "https://picsum.photos/640/480",
    },
    {
      id: "5678",
      author: "Jane Doe",
      category: "Software Development",
      title: "Introduction to Design",
      courseLessonCount: 5,
      description: "Learn the basics of design",
      enrolled: true,
      enrolledParticipantCount: 3,
      imageUrl: "https://picsum.photos/640/480",
    },
    {
      id: "91011",
      author: "John Doe",
      category: "Accounting and Finance",
      title: "Principles of Accounting and Financial Management",
      courseLessonCount: 3,
      description:
        "Gain a comprehensive understanding of the fundamental principles and practices in accounting and financial management.",
      enrolled: true,
      enrolledParticipantCount: 1,
      imageUrl: "https://picsum.photos/640/480",
    },
  ],
  pagination: { totalItems: 3, page: 1, perPage: 100 },
};

export const availableCourses = {
  data: [
    {
      id: "9876",
      author: "Tyler Durden",
      category: "Software Development",
      title: "Programming Basics",
      courseLessonCount: 5,
      description: "Learn the basics of programming",
      enrolled: false,
      enrolledParticipantCount: 3,
      imageUrl: "https://picsum.photos/640/480",
    },
    {
      id: "2187",
      author: "Ellen Ripley",
      category: "Xenobiology",
      title: "Surviving Extraterrestrial Encounters",
      courseLessonCount: 4,
      description: "Learn essential skills for dealing with hostile alien life forms",
      enrolled: false,
      enrolledParticipantCount: 1979,
      imageUrl: "https://picsum.photos/640/480",
    },
    {
      id: "2049",
      author: "Officer K",
      category: "Investigative Techniques",
      title: "Blade Running: Replicant Detection and Retirement",
      courseLessonCount: 6,
      description:
        "Master the art of identifying and handling artificial humans in urban environments",
      enrolled: false,
      enrolledParticipantCount: 2017,
      imageUrl: "https://picsum.photos/640/480",
    },
  ],
  pagination: { totalItems: 3, page: 1, perPage: 100 },
};
