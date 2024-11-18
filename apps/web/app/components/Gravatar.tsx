import CryptoJS from "crypto-js";

import { AvatarImage } from "./ui/avatar";

type GravatarProps = {
  email: string | undefined;
  size?: number;
  className?: string;
};

export const Gravatar = ({ email, size = 200, className = "" }: GravatarProps) => {
  const defaultGravatarHash = "27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109";

  const hash = email ? CryptoJS.MD5(email.toLowerCase().trim()).toString() : defaultGravatarHash;
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
