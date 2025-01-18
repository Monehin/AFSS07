import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Profile, SocialMediaLink, User } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export interface ProfileWithUser extends Profile {
  user: User;
  socialMediaLinks: SocialMediaLink[];
  error?: string;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: true, socialMediaLinks: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `An unexpected error occurred. ${error}` },
      { status: 500 }
    );
  }
}
