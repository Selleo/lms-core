export const upperFirstLetter = (arr: string[]): string => {
  if (!arr || arr.length === 0) {
    console.warn("Array is empty or undefined");
    return "";
  }
  if (arr.every((item) => typeof item !== "string")) {
    console.warn("All elements in the array must be of type string");
    return "";
  }
  return arr
    .map((str) => str!.charAt(0).toUpperCase() + str!.slice(1).toLowerCase())
    .join(" ");
};
