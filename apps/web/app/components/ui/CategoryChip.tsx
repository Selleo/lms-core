import {Dot} from "lucide-react";

type Props = {
  category: string;
}
export const CategoryChip = ({category}:Props) => {
  return (
      <div className="max-w-full bg-white px-2 py-1 rounded-lg items-center flex">
        <Dot className="flex-shrink-0 fill-blue-700"/>
        <div className="truncate text-xs ml-1">{category}</div>
      </div>
  );
};

