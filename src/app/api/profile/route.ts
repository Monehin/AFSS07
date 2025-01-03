import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";

export interface GetProfileResponse {
  profile?: Profile;
  error?: string;
}

export async function GET(request: Request): Promise<Response> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/");
  }

  let profile = await db.profile.findUnique({
    where: {
      userId: clerkUser.id,
    },
  });

  if (!profile) {
    return Response.json({ error: "Profile not found." });
  }

  return Response.json({ profile });
}
