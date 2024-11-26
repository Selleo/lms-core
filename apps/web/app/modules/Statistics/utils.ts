type Data =
  | Record<string, { started: number; completed: number; completionRate: number }>
  | object
  | undefined;

export const parseRatesChartData = (data: Data) => {
  if (!data) return [];

  return Object.entries(data).map(([month, values]) => ({
    month,
    started: values.started,
    completed: values.completed,
  }));
};
