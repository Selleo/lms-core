import CryptoJS from "crypto-js";

import { AvatarImage } from "./ui/avatar";

type GravatarProps = {
  email: string;
  size?: number;
  className?: string;
};

export const Gravatar = ({ email, size = 200, className = "" }: GravatarProps) => {
  const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;

  return (
    <AvatarImage
      src={gravatarUrl}
      alt={`Avatar for ${email}`}
      className={className}
      width={size}
      height={size}
    />
  );
};
