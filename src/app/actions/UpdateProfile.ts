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

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data,
    });

    console.log("Monehin");

    revalidatePath("/");

    return { data: updatedProfile };
  } catch (error) {
    return { error: "Profile update not successfull" };
  }
}
