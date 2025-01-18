import Image from "next/image";
import React from "react";

export const platformIds = [
  "linkedin",
  "instagram",
  "x",
  "youtube",
  "facebook",
] as const;

interface LogoIconProps {
  icon: string;
  width?: number;
  height?: number;
  className?: string;
}

const LogoIcon = ({ icon, width, height, className }: LogoIconProps) => {
  return (
    <Image
      src={`/logos/${icon}.png`}
      alt={icon}
      width={width ? width : 20}
      height={height ? height : 20}
      className={className}
    />
  );
};

export default LogoIcon;
