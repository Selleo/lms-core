import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import type { PropsWithChildren } from "react";
import type { ButtonProps } from "~/components/ui/button";

type CopyUrlButtonProps = PropsWithChildren<ButtonProps>;

export const CopyUrlButton = ({ children, ...props }: CopyUrlButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  return (
    <TooltipProvider>
      <Tooltip open={isCopied}>
        <TooltipTrigger asChild>
          <Button {...props} onClick={handleCopy}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>The URL address was copied to the clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
