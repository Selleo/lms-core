import { type FC, Fragment } from "react";

type FillInTheTextBlanksProps = {
  content: string;
  replacement: (index: number) => JSX.Element;
};

export const FillInTheTextBlanks: FC<FillInTheTextBlanksProps> = ({
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
