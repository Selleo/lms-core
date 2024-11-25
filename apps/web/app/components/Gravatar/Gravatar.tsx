import CryptoJS from "crypto-js";

import { AvatarImage } from "../ui/avatar";

import { DEFAULT_GRAVATAR_HASH } from "./gravatar.const";

type GravatarProps = {
  email: string | undefined;
  size?: number;
  className?: string;
};

export const Gravatar = ({ email, size = 200, className = "" }: GravatarProps) => {
  const hash = email ? CryptoJS.MD5(email.toLowerCase().trim()).toString() : DEFAULT_GRAVATAR_HASH;
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;

  return (
    <AvatarImage
      src={gravatarUrl}
      alt={`Avatar for ${email ?? "unknown"}`}
      className={className}
      width={size}
      height={size}
    />
  );
};
