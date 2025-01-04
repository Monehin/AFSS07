import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
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

  revalidatePath("/");
  return Response.json(user);
}
