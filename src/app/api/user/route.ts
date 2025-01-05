import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { Profile, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface UserWithProfile extends User {
  profile?: Profile; // optional, no "null"
}

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Safely handle the possibility that primaryEmailAddress or emailAddress is undefined
  const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
  if (!primaryEmail) {
    throw new Error(
      "Unable to retrieve primary email address for the current user."
    );
  }

  const foundUser = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: { profile: true },
  });

  const user: UserWithProfile | null = foundUser
    ? {
        ...foundUser,
        profile: foundUser.profile ?? undefined,
      }
    : null;

  let finalUser = user;
  if (!finalUser) {
    const created = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: primaryEmail, // Use the safely checked `primaryEmail`
        name: clerkUser.firstName,
        imageUrl: clerkUser.imageUrl,
      },
    });

    finalUser = { ...created, profile: undefined };
  }

  revalidatePath("/");

  return Response.json(finalUser);
}
