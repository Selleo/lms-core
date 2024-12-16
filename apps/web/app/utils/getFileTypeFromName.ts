export const getFileTypeFromName = (fileName: string | null) => {
  if (typeof fileName !== "string") {
    throw new Error("Input must be a string");
  }

  const parts = fileName.split(".");

  return parts.length > 1 ? parts[parts.length - 1] : null;
};
