import { z } from "zod";

// Define platform IDs explicitly
export const platformIds = [
  "linkedin",
  "instagram",
  "x",
  "youtube",
  "facebook",
] as const;

// Platform options

interface PlatformOption {
  id: (typeof platformIds)[number];
  label: string;
  basePath: string;
  color?: string; // Hex color code
  background?: string; // Hex color code
}

export const platformOptions: PlatformOption[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    basePath: "https://www.linkedin.com/in/",
    color: `#0077B5`,
  },
  {
    id: "instagram",
    label: "Instagram",
    basePath: "https://www.instagram.com/",
    color: `linear-gradient(115deg, #f9ce34, #ee2a7b, #6228d7)`,
  },
  {
    id: "x",
    label: "X ",
    basePath: "https://x.com/",
    color: `#000000`,
  },
  {
    id: "youtube",
    label: "YouTube",
    basePath: "https://www.youtube.com/@",
    color: `#FF0000`,
  },
  {
    id: "facebook",
    label: "Facebook",
    basePath: "https://www.facebook.com/",
    color: `#0077B5`,
  },
];

// SocialMediaLinkSchema
export const SocialMediaLinkSchema = z.object({
  url: z.string().url({ message: "Invalid URL format." }),
  platform: z.enum(platformIds, {
    errorMap: () => ({ message: "Invalid social media platform selected." }),
  }),
});
