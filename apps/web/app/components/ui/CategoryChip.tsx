import { Dot } from "lucide-react";

type Props = {
  category: string;
};

export const CategoryChip = ({ category }: Props) => {
  return (
    <div className="max-w-fit bg-white px-2 py-1 rounded-lg items-center flex gap-2">
      <Dot
        size={8}
        strokeWidth={4}
        className="flex-shrink-0 text-primary-700"
        absoluteStrokeWidth
      />
      <div className="truncate text-xs text-primary-950">{category}</div>
    </div>
  );
};
