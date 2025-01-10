import { createRemixStub } from "@remix-run/testing";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { last } from "lodash-es";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { availableCourses, studentCourses } from "~/utils/mocks/data/courses";
import { setMatchingMediaQuery } from "~/utils/mocks/matchMedia.mock";
import { mockRemixReact } from "~/utils/mocks/remix-run-mock";
import { renderWith } from "~/utils/testUtils";

import CoursesPage from "./Courses.page";

vi.mock("../../../api/api-client");
mockRemixReact();

describe.skip("Courses page", () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: () => (
        <Suspense>
          <CoursesPage />
        </Suspense>
      ),
    },
  ]);

  beforeEach(() => {
    vi.resetAllMocks();
    setMatchingMediaQuery("(min-width: 1200px)");
  });

  describe("enrolled courses", () => {
    it("renders student courses correctly", async () => {
      renderWith({ withQuery: true }).render(<RemixStub />);

      const enrolledCoursesSection = await screen.findByTestId("enrolled-courses");
      const courseCards = await within(enrolledCoursesSection).findAllByRole("link");

      expect(courseCards).toHaveLength(studentCourses.data.length);

      studentCourses.data.forEach((course, index) => {
        const card = courseCards[index];
        expect(card).toHaveTextContent(course.title);
        expect(card).toHaveTextContent(course.description);
        expect(card).toHaveTextContent(course.category);

        const buttonText = course.enrolled ? "Continue" : "Enroll";
        expect(within(card).getByRole("button")).toHaveTextContent(buttonText);
        expect(card).toHaveAttribute("href", `/course/${course.id}`);
      });
    });
  });

  describe("unenrolled courses", () => {
    it("renders student courses correctly", async () => {
      renderWith({ withQuery: true }).render(<RemixStub />);

      const unenrolledCoursesSection = await screen.findByTestId("unenrolled-courses");
      const courseCards = await within(unenrolledCoursesSection).findAllByRole("link");

      expect(courseCards).toHaveLength(availableCourses.data.length);

      availableCourses.data.forEach((course, index) => {
        const card = courseCards[index];
        expect(card).toHaveTextContent(course.title);
        expect(card).toHaveTextContent(course.description);
        expect(card).toHaveTextContent(course.category);

        const buttonText = course.enrolled ? "Continue" : "Enroll";
        expect(within(card).getByRole("button")).toHaveTextContent(buttonText);
        expect(card).toHaveAttribute("href", `/course/${course.id}`);
      });
    });

    it("displays matching courses when searching by name", async () => {
      const inputText = "Surviving";
      renderWith({ withQuery: true }).render(<RemixStub />);

      const unenrolledCoursesSection = await screen.findByTestId("unenrolled-courses");
      const searchInput = await screen.findByRole("textbox");

      await waitFor(() => {
        userEvent.type(searchInput, inputText);
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
      });

      const courseCards = await within(unenrolledCoursesSection).findAllByRole("link");

      expect(courseCards).toHaveLength(1);
      expect(last(courseCards)).toHaveTextContent("Xenobiology");
    });

    it("displays matching courses when filtering by category", async () => {
      renderWith({ withQuery: true }).render(<RemixStub />);

      const [categoriesSelect] = await screen.findAllByRole("combobox");
      expect(categoriesSelect).toHaveTextContent("All Categories");

      userEvent.click(categoriesSelect);

      const categoriesDropdown = await screen.findByRole("listbox");
      const categoryOptions = within(categoriesDropdown).getAllByRole("option");
      expect(categoryOptions).toHaveLength(4);

      userEvent.click(categoryOptions[1]);

      await waitFor(() => {
        expect(categoriesSelect).toHaveTextContent("Software Development");
      });

      const unenrolledCoursesSection = await screen.findByTestId("unenrolled-courses");
      const courseCards = await within(unenrolledCoursesSection).findAllByRole("link");

      expect(courseCards).toHaveLength(1);
    });

    it("display empty courses message when no courses match the search", async () => {
      renderWith({ withQuery: true }).render(<RemixStub />);

      const searchInput = await screen.findByRole("textbox");

      await waitFor(() => {
        userEvent.type(searchInput, "Test");
      });

      await waitFor(() => {
        expect(screen.getByText("We could not find any courses")).toBeInTheDocument();
      });
    });

    it("display sorted courses when sort value is changed", async () => {
      const reversedCourseData = [...availableCourses.data].sort((a, b) =>
        b.title.localeCompare(a.title),
      );

      renderWith({ withQuery: true }).render(<RemixStub />);

      const [, sortSelect] = await screen.findAllByRole("combobox");
      expect(sortSelect).toHaveTextContent("Sort");

      userEvent.click(sortSelect);

      const sortDropdown = await screen.findByRole("listbox");
      userEvent.click(within(sortDropdown).getByRole("option", { name: "Course Name Z-A" }));

      await waitFor(() => {
        expect(sortSelect).toHaveTextContent("Course Name Z-A");
      });

      const unenrolledCoursesSection = await screen.findByTestId("unenrolled-courses");

      await waitFor(() => {
        const courseCards = within(unenrolledCoursesSection).getAllByRole("link");
        const renderedTitles = courseCards.map(
          (card) => within(card).getByRole("heading").textContent,
        );
        const expectedTitles = reversedCourseData.map((course) => course.title);

        expect(renderedTitles).toEqual(expectedTitles);
      });
    });

    it('clears search and filters when "Clear All" is clicked', async () => {
      const user = userEvent.setup();

      renderWith({ withQuery: true }).render(<RemixStub />);

      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      const searchInput = screen.getByRole("textbox");
      await user.type(searchInput, "Programming");

      const [categoriesSelect, sortSelect] = screen.getAllByRole("combobox");

      await user.click(categoriesSelect);

      await waitFor(() => {
        expect(screen.getByRole("option", { name: "Software Development" })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("option", { name: "Software Development" }));

      await waitFor(() => {
        expect(sortSelect).not.toBeDisabled();
      });

      await user.click(sortSelect);

      await waitFor(() => {
        expect(screen.getByRole("option", { name: "Category A-Z" })).toBeInTheDocument();
      });

      await user.click(screen.getByRole("option", { name: "Category A-Z" }));

      const clearAllButton = await screen.findByRole("button", {
        name: "Clear All",
      });

      await user.click(clearAllButton);

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Clear All" })).not.toBeInTheDocument();
        expect(searchInput).toHaveValue("");
        expect(categoriesSelect).toHaveTextContent("All Categories");
        expect(sortSelect).toHaveTextContent("Sort");
      });
    });
  });
});
