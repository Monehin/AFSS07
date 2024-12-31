"use server";

import { auth } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateProfile(data: Prisma.ProfileUpdateInput) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("You must be logged in to update your profile.");
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data,
    });

    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Unable to update profile. Check your data and try again.");
  }
}
