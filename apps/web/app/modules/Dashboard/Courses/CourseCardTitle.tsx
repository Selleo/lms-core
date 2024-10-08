import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "~/components/ui/tooltip";

export const CourseCardTitle = ({ title }: { title: string }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        const { offsetHeight, scrollHeight } = titleRef.current;
        setIsTruncated(scrollHeight > offsetHeight);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [title]);

  return (
    <TooltipProvider>
      {isTruncated ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <h3
              ref={titleRef}
              className="font-bold text-lg text-neutral-950 line-clamp-2"
            >
              {title}
            </h3>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
            <TooltipArrow className="z-[51] absolute -top-px" />
          </TooltipContent>
        </Tooltip>
      ) : (
        <h3
          ref={titleRef}
          className="font-bold text-lg text-neutral-950 line-clamp-2"
        >
          {title}
        </h3>
      )}
    </TooltipProvider>
  );
};
