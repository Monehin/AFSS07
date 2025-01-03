"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile, User } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Profile to include user
export interface ProfileWithUser extends Profile {
  user: User;
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

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: true },
    });
    return { data: profile || undefined };
  } catch (error) {
    return { error: error as string };
  }
}
