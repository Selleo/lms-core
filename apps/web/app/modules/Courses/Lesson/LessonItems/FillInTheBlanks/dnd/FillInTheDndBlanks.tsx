import { type FC, Fragment } from "react";

type FillInTheDndBlanksProps = {
  content: string;
  replacement: (index: number) => JSX.Element;
};

export const FillInTheDndBlanks: FC<FillInTheDndBlanksProps> = ({
  content,
  replacement,
}) => {
  const parts = content.split(/\[word]/g);

  return (
    <div className="flex flex-wrap text-neutral-900 body-base items-center">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && replacement(index)}
        </Fragment>
      ))}
    </div>
  );
};
