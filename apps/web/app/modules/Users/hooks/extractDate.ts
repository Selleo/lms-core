export function extractDate(date: string): string {
  const datePart = date.split(" ")[0];
  return datePart;
}
