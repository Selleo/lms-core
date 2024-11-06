import type { ReactNode } from "react";

type CreatePageHeaderProps = {
  title: string | ReactNode;
  description: string | ReactNode;
};

export const CreatePageHeader = ({ title, description }: CreatePageHeaderProps) => {
  return (
    <hgroup>
      <h2 className="h1">{title}</h2>
      <p className="body-md">{description}</p>
    </hgroup>
  );
};
