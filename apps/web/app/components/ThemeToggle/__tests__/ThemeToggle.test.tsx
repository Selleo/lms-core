import { describe, expect, it } from "vitest";
import { screen, fireEvent } from "@testing-library/react";

import ThemeToggle from "../ThemeToggle";
import { renderWith } from "../../../utils/testUtils";

describe("ThemeToggle", () => {
  it("renders without crashing", () => {
    renderWith({
      withTheme: true,
    }).render(<ThemeToggle />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles theme", async () => {
    renderWith({
      withTheme: true,
    }).render(<ThemeToggle />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(await screen.findByLabelText(/dark/)).toBeInTheDocument();
    fireEvent.click(button);
    expect(await screen.findByLabelText(/light/)).toBeInTheDocument();
  });
});
