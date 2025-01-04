"use server";

import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

interface UserResponse {
  data?: User;
  error?: string;
}

export async function getUser(): Promise<UserResponse> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { error: "User not authenticated." };
  }

  let user = await db.user.findUnique({
    where: {
      clerkUserId: clerkUser.id,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.primaryEmailAddress!.emailAddress,
        name: clerkUser.firstName,
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  return { data: user };
}
