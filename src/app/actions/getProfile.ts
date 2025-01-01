"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

interface ProfileResponse {
  data?: Profile;
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
    });
    return { data: profile || undefined };
  } catch (error) {
    return { error: error as string };
  }
}
