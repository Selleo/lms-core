type PositionObject = { position: number };

export const setColumnsPosition = (
  array: string[],
  existingConfig: Record<string, any> = {},
): Record<string, any> => {
  const positions = array.reduce<Record<string, PositionObject>>(
    (acc, key, index) => {
      acc[key] = { position: index + 1 };
      return acc;
    },
    {},
  );

  return Object.keys(positions).reduce(
    (acc, key) => {
      acc[key] = {
        ...existingConfig[key],
        ...positions[key],
      };

      return acc;
    },
    { ...existingConfig },
  );
};
