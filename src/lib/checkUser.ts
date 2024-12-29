import { currentUser } from "@clerk/nextjs/server";

import db from "./db";

export async function checkUser() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (!dbUser) {
    const newDbUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.primaryEmailAddress!.emailAddress,
        name: user.fullName,
        imageUrl: user.imageUrl,
        profile: {
          create: {
            name: user.fullName,
          },
        },
      },
    });

    return newDbUser;
  }

  return dbUser;
}
