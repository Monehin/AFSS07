"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile, SocialMediaLink } from "@prisma/client";

const prisma = new PrismaClient();

export interface ExtendedProfile extends Profile {
  socialMediaLinks: SocialMediaLink[];
}

export async function getAllVerifiedProfile(): Promise<{
  data?: ExtendedProfile[];
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be logged in to access profiles." };
    }

    const profiles = await prisma.profile.findMany({
      where: {
        user: {
          verified: true,
        },
      },
      include: {
        user: true,
        socialMediaLinks: true,
      },
    });

    return { data: profiles };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to fetch profiles: ${errorMessage}` };
  }
}
