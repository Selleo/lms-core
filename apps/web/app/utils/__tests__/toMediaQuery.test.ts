import { toMediaQuery } from "~/utils/toMediaQuery";

describe("toMediaQuery", () => {
  it("should return the input string if param is a string", () => {
    const input = "(min-width: 768px)";
    expect(toMediaQuery(input)).toBe(input);
  });

  it("should return a valid media query for an object with only minWidth", () => {
    const param = { minWidth: 768 };
    expect(toMediaQuery(param)).toBe("(min-width: 768px)");
  });

  it("should return a valid media query for an object with only maxWidth", () => {
    const param = { maxWidth: 1024 };
    expect(toMediaQuery(param)).toBe("(max-width: 1024px)");
  });

  it("should return a valid media query for an object with both minWidth and maxWidth", () => {
    const param = { minWidth: 768, maxWidth: 1024 };
    expect(toMediaQuery(param)).toBe("(min-width: 768px) and (max-width: 1024px)");
  });

  it("should return an empty string if an empty object is provided", () => {
    const param = {};
    expect(toMediaQuery(param)).toBe("");
  });

  it("should handle cases where invalid or unexpected keys are provided", () => {
    const param = { minHeight: 600, minWidth: 768 };
    expect(toMediaQuery(param)).toBe("(min-width: 768px)");
  });

  it("should correctly handle additional non-standard keys and ignore them", () => {
    const param = { minWidth: 768, maxWidth: 1024, someKey: 500 };
    expect(toMediaQuery(param)).toBe("(min-width: 768px) and (max-width: 1024px)");
  });
});
