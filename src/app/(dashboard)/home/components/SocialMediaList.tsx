"use client";
import LogoIcon from "@/components/LogoIcon";
import { platformOptions } from "@/utils/platformOptions";
import { SocialMediaLink } from "@prisma/client";

const SocialMediaList = ({
  socialMediaLinks,
}: {
  socialMediaLinks: SocialMediaLink[];
}) => {
  return (
    <div className="flex space-x-2 items-center">
      {socialMediaLinks && Array.isArray(socialMediaLinks)
        ? socialMediaLinks.map(({ url, platform }: SocialMediaLink) => {
            const media = platformOptions.find(
              (option) => option.id === platform
            );
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
          })
        : null}
    </div>
  );
};

export default SocialMediaList;
