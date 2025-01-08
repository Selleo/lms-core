import { type FC, Fragment } from "react";

import Viewer from "~/components/RichText/Viever";

type FillInTheDndBlanksProps = {
  content: string;
  replacement: (index: number) => JSX.Element;
};

export const SentenceBuilder: FC<FillInTheDndBlanksProps> = ({ content, replacement }) => {
  const parts = content?.split(/\[word]/g);

  return (
    <div className="flex flex-wrap gap-y-2 text-neutral-900 body-base items-center">
      {parts?.map((part, index) => (
        <Fragment key={index}>
          <Viewer content={part} />
          {index < parts.length - 1 && replacement(index)}
        </Fragment>
      ))}
    </div>
  );
};
