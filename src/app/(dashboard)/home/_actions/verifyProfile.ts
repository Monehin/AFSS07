"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface ApproveResponse {
  data?: User;
  error?: string;
}

export async function verifyProfile(userId: string): Promise<ApproveResponse> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { error: "You must be logged in to approve join requests." };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // Update the user's verified status
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        verified: true,
        verifiedById: clerkId,
      },
    });
    revalidatePath("/");

    return { data: updatedUser };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to approve request: ${errorMessage}` };
  }
}
