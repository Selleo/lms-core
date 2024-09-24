import {Dot} from "lucide-react";

type Props = {
  category: string;
}
export const CategoryChip = ({category}:Props) => {
  return (
      <div className="flex bg-white px-2 py-1 rounded-lg items-center">
        <Dot className="fill-blue-700"/>
        <div className="truncate text-xs">{category}</div>
      </div>
  );
};

