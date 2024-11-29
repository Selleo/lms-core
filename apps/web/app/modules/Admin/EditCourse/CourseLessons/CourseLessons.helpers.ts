export const mapItemType = (itemType: string): string => {
  const typeMapping: { [key: string]: string } = {
    text_block: "Text",
  };

  return typeMapping[itemType] || itemType;
};

export const mapTypeToIcon = (itemType: string): string => {
  const iconMapping: { [key: string]: string } = {
    text_block: "Text",
  };

  return iconMapping[itemType];
};
