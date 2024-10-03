export const courses = {
  data: [
    {
      id: "1234",
      author: "John Doe",
      category: "Software Development",
      title: "Introduction to Programming",
      courseLessonCount: 5,
      description: "Learn the basics of programming",
      enrolled: false,
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
      enrolled: false,
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
