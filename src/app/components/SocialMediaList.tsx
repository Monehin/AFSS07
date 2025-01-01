"use client";
import { platformOptions } from "@/utils/platformOptions";
interface SocialMediaLink {
  url: string;
  platform: string;
}

const SocialMediaList = ({
  socialMediaLinks,
}: {
  socialMediaLinks: SocialMediaLink[];
}) => {
  return (
    <div className="flex space-x-2">
      {socialMediaLinks && Array.isArray(socialMediaLinks)
        ? socialMediaLinks.map(({ url, platform }: SocialMediaLink) => {
            const media = platformOptions.find(
              (option) => option.id === platform
            );
            const Icon = media?.icon;
            const color = media?.color;
            if (Icon) {
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            }
          })
        : null}
    </div>
  );
};

export default SocialMediaList;
