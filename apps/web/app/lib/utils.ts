import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWithPlural(count: number, singular: string, plural: string) {
  if (count === 0) return null;

  const pluralizedLabel = count === 1 ? singular : plural;
  return `${count} ${pluralizedLabel}`;
}
