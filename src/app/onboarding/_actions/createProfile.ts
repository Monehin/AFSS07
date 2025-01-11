"use server";

import { auth } from "@clerk/nextjs/server";
import { Prisma, PrismaClient, Profile } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface ProfileResponse {
  data?: Profile;
  error?: string;
}

export async function createProfile(
  data: Prisma.ProfileCreateInput
): Promise<ProfileResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("You must be logged in to create your profile.");
    }

    // Check if a profile already exists for the user
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      throw new Error("A profile already exists for this user.");
    }

    // Create the Profile
    const profile = await prisma.profile.create({
      data: {
        ...data,
        firstName: user.firstName || user.fullName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    // Revalidate the path to ensure the changes are reflected on the front end
    revalidatePath("/");

    return { data: profile };
  } catch (error) {
    return { error: `Profile creation not successful: ${error}` };
  }
}
