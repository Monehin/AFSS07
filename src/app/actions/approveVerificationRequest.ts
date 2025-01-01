"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface ApproveResponse {
  success?: boolean;
  error?: string;
}

export async function approveVerificationRequest(
  userId: string
): Promise<ApproveResponse> {
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
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        verified: true,
        verifiedById: clerkId,
      },
    });
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to approve request: ${errorMessage}` };
  }
}
