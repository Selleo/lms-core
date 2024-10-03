import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { mockRemixReact } from "~/utils/mocks/remix-run-mock";
import { renderWith } from "~/utils/testUtils";
import { createRemixStub } from "@remix-run/testing";
import DashboardPage from "./Dashboard.page";
import { Suspense } from "react";
import { courses } from "~/utils/mocks/data/courses";
import { userEvent } from "@testing-library/user-event";
import { server } from "~/utils/mocks/node";
import { http, HttpResponse } from "msw";
import { withSearchParams } from "~/utils/mocks/resolvers/withSearchParams";

vi.mock("../../../api/api-client");

mockRemixReact();

describe("Dashboard page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: () => (
        <Suspense>
          <DashboardPage />
        </Suspense>
      ),
    },
  ]);

  it("renders courses correctly", async () => {
    renderWith({ withQuery: true }).render(<RemixStub />);

    const courseCards = await screen.findAllByRole("link");

    expect(courseCards).toHaveLength(courses.data.length);

    courses.data.forEach((course, index) => {
      expect(courseCards[index]).toHaveTextContent(course.title);
      expect(courseCards[index]).toHaveTextContent(course.description);
      expect(courseCards[index]).toHaveTextContent(course.category);

      const buttonText = course.enrolled ? "Continue" : "Enroll";
      expect(within(courseCards[index]).getByRole("button")).toHaveTextContent(
        buttonText
      );
      expect(courseCards[index]).toHaveAttribute(
        "href",
        `/course/${course.id}`
      );
    });
  });

  it("displays matching courses when searching by name", async () => {
    const inputText = "Accounting";

    server.use(
      http.get(
        "/api/courses",
        withSearchParams(
          (params) => params.get("title") === inputText,
          () => HttpResponse.json({ ...courses, data: [courses.data[2]] })
        )
      )
    );

    renderWith({ withQuery: true }).render(<RemixStub />);

    const searchInput = await screen.findByRole("textbox");

    await waitFor(() => {
      userEvent.type(searchInput, inputText);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Clear All" })
      ).toBeInTheDocument();
    });

    const courseCards = await screen.findAllByRole("link");
    expect(courseCards).toHaveLength(1);
    expect(courseCards[0]).toHaveTextContent("Accounting and Finance");
  });

  it("displays matching courses when filtering by category", async () => {
    server.use(
      http.get(
        "/api/courses",
        withSearchParams(
          (params) => params.get("category") === "Software Development",
          () => HttpResponse.json({ ...courses, data: courses.data.slice(1) })
        )
      )
    );

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

    const courseCards = await screen.findAllByRole("link");
    expect(courseCards).toHaveLength(2);
  });

  it("display empty courses message when no courses match the search", async () => {
    server.use(
      http.get(
        "/api/courses",
        withSearchParams(
          (params) => params.get("title") === "Test",
          () => HttpResponse.json({ ...courses, data: [] })
        )
      )
    );

    renderWith({ withQuery: true }).render(<RemixStub />);

    const searchInput = await screen.findByRole("textbox");

    await waitFor(() => {
      userEvent.type(searchInput, "Test");
    });

    await waitFor(() => {
      expect(
        screen.getByText("We could not find any courses")
      ).toBeInTheDocument();
    });
  });

  it("display sorted courses when sort value is changed", async () => {
    const reversedCourseData = courses.data.slice().reverse();

    server.use(
      http.get(
        "/api/courses",
        withSearchParams(
          (params) => params.get("sort") === "-title",
          () =>
            HttpResponse.json({
              ...courses,
              data: reversedCourseData,
            })
        )
      )
    );

    renderWith({ withQuery: true }).render(<RemixStub />);

    const [, sortSelect] = await screen.findAllByRole("combobox");
    expect(sortSelect).toHaveTextContent("Sort");

    userEvent.click(sortSelect);

    const sortDropdown = await screen.findByRole("listbox");
    userEvent.click(
      within(sortDropdown).getByRole("option", { name: "Course Name Z-A" })
    );

    await waitFor(() => {
      expect(sortSelect).toHaveTextContent("Course Name Z-A");
    });

    const courseCards = await screen.findAllByRole("link");
    reversedCourseData.forEach((course, index) => {
      expect(courseCards[index]).toHaveTextContent(course.title);
    });
  });

  it('clears search and filters when "Clear All" is clicked', async () => {
    renderWith({ withQuery: true }).render(<RemixStub />);

    const searchInput = await screen.findByRole("textbox");

    await waitFor(() => {
      userEvent.type(searchInput, "Programming");
    });

    const [categoriesSelect, sortSelect] = screen.getAllByRole("combobox");

    userEvent.click(categoriesSelect);
    userEvent.click(
      await screen.findByRole("option", { name: "Software Development" })
    );

    await waitFor(() => {
      expect(sortSelect).not.toBeDisabled();
    });

    userEvent.click(sortSelect);
    userEvent.click(
      await screen.findByRole("option", { name: "Category A-Z" })
    );

    let hasClearedFilters = false;

    server.use(
      http.get("/api/courses", ({ params }) => {
        if (!params.title && !params.category && !params.sort) {
          hasClearedFilters = true;
        }
        return HttpResponse.json(courses);
      })
    );

    const clearAllButton = await screen.findByRole("button", {
      name: "Clear All",
    });
    userEvent.click(clearAllButton);

    await waitFor(() => {
      expect(clearAllButton).not.toBeInTheDocument();
    });

    expect(searchInput).toHaveValue("");
    expect(categoriesSelect).toHaveTextContent("All Categories");
    expect(sortSelect).toHaveTextContent("Sort");
    expect(hasClearedFilters).toBe(true);
  });
});
