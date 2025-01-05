"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

interface ProfileResponse {
  data?: Profile[];
  error?: string;
}
export async function getAllUnverifiedProfiles(): Promise<ProfileResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "You must be logged in to access join requests." };
    }

    const joinRequests = await prisma.profile.findMany({
      where: {
        user: {
          verified: false,
          clerkUserId: {
            not: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return { data: joinRequests };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to fetch join requests: ${errorMessage}` };
  }
}
