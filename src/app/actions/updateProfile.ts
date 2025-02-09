"use server";

import { ProfileType } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateProfile(data: ProfileType) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to update your profile.");
    }

    if (!data.firstName || !data.lastName) {
      throw new Error("First name and last name are required.");
    }

    // Convert 'dob' string to Date if it's provided as string
    let dob: Date | null = null;
    if (typeof data.dob === "string" && data.dob.length > 0) {
      dob = new Date(data.dob);
    } else if (data.dob instanceof Date) {
      dob = data.dob;
    }

    // Update the Profile (excluding userId, id, etc.)
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dob,
        phone: data.phone,
        email: data.email,
        career: data.career,
        address: data.address,
        country: data.country,
        city: data.city,
        advice: data.advice,
        state: data.state,
        bio: data.bio,
        emergencyContact: data.emergencyContact,
        zip: data.zip,
        imageUrl: data.imageUrl,
        socialMediaLinks: data.socialMediaLinks
          ? {
              deleteMany: {}, // delete all existing
              create: data.socialMediaLinks.map((link) => ({
                platform: link.platform,
                url: link.url,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/");
    return { data: updatedProfile };
  } catch (error) {
    throw new Error(`Profile update not successful: ${error}`);
  }
}
