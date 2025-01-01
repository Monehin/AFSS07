"use server";

import { auth } from "@clerk/nextjs/server";
import { Prisma, PrismaClient, Profile } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface ProfileResponse {
  data?: Profile;
  error?: string;
}

export async function updateProfile(
  data: Prisma.ProfileUpdateInput
): Promise<ProfileResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to update your profile.");
    }

    if (!data.firstName || !data.lastName) {
      throw new Error("First name and last name are required.");
    }

    // Combine firstName and lastName for the fullName and user's name
    const fullName = `${data.firstName} ${data.lastName}`;

    // Update the Profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        fullName,
      },
    });

    // Update the User name
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        name: fullName,
      },
    });

    // Revalidate the path to ensure the changes are reflected on the front end
    revalidatePath("/");

    return { data: updatedProfile };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Profile update not successful" };
  }
}
