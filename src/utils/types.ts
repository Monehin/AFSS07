import { User } from "@prisma/client";

export interface SocialMediaLink {
  platform: string;
  url: string;
  id?: string;
  userId?: string;
}

export interface ProfileType {
  firstName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  phone?: string | null;
  email?: string | null;
  career?: string | null;
  address?: string | null;
  bio?: string | null;
  emergencyContact?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  imageUrl?: string | null;
  socialMediaLinks?: SocialMediaLink[];
  user?: User;
}
