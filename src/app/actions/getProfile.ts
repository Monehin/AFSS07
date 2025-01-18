"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Profile, SocialMediaLink, User } from "@prisma/client";

export interface ProfileWithUser extends Profile {
  user?: User;
  socialMediaLinks?: SocialMediaLink[];
}

interface ProfileResponse {
  data?: ProfileWithUser;
  error?: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to update your profile.");
    }

    const profile = await db.profile.findUnique({
      where: { userId },
      include: { user: true, socialMediaLinks: true },
    });
    if (profile) {
      return { data: profile };
    } else {
      throw new Error("Profile not found.");
    }
  } catch (error) {
    return { error: error as string };
  }
}
