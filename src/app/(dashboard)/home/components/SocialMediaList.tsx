"use client";

import LogoIcon from "@/components/LogoIcon";
import { platformOptions } from "@/utils/platformOptions";
import { SocialMediaLink } from "@prisma/client";

const SocialMediaList = ({
  socialMediaLinks,
}: {
  socialMediaLinks: SocialMediaLink[];
}) => {
  const sortedSocialMediaLinks =
    socialMediaLinks && Array.isArray(socialMediaLinks)
      ? [...socialMediaLinks].sort((a, b) =>
          a.platform.localeCompare(b.platform)
        )
      : [];

  return (
    <div className="flex justify-start items-center flex-wrap gap-x-2 gap-y-3">
      {sortedSocialMediaLinks.map(({ url, platform }: SocialMediaLink) => {
        const media = platformOptions.find((option) => option.id === platform);
        const color = media?.color;
        return (
          <a
            key={platform}
            href={`${media?.basePath}${url}`}
            target="_blank"
            rel="noreferrer"
            style={{ color }}
          >
            <LogoIcon icon={platform} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaList;
