type PositionObject = { position: number };

export const setColumnsPosition = (
  array: string[],
): Record<string, PositionObject> => {
  return array.reduce<Record<string, PositionObject>>((acc, key, index) => {
    acc[key] = { position: index + 1 };
    return acc;
  }, {});
};
