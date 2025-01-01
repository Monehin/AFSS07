"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

interface ProfileResponse {
  data?: Profile[];
  error?: string;
}

export async function getAllProfile(): Promise<ProfileResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be logged in to access profiles." };
    }

    const profiles = await prisma.profile.findMany();
    return { data: profiles };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to fetch profiles: ${errorMessage}` };
  }
}
