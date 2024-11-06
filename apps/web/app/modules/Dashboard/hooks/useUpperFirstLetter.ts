export const upperFirstLetter = (array: string[]): string => {
  if (!array || array.length === 0) {
    console.warn("Array is empty or undefined");
    return "";
  }
  if (array.every((item) => typeof item !== "string")) {
    console.warn("All elements in the array must be of type string");
    return "";
  }
  return array
    .map((string) => string!.charAt(0).toUpperCase() + string!.slice(1).toLowerCase())
    .join(" ");
};
