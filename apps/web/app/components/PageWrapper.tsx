import * as React from "react";
export const PageWrapper = ({
  children,
  header,
  PageWrapperButton,
}: {
  children: React.ReactNode;
  header: string;
  PageWrapperButton: React.ComponentType;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{header}</h1>
        <PageWrapperButton />
      </div>
      {children}
    </div>
  );
};
