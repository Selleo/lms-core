export const mapItemType = (itemType: string): string => {
  const typeMapping: { [key: string]: string } = {
    text_block: "Text",
    video: "Video",
    presentation: "Presentation",
    question: "Quiz",
  };

  return typeMapping[itemType] || "Quiz";
};

export const mapTypeToIcon = (itemType: string): string => {
  const iconMapping: { [key: string]: string } = {
    text_block: "Text",
    video: "Video",
    presentation: "Presentation",
    question: "Quiz",
  };

  return iconMapping[itemType] || "Quiz";
};
