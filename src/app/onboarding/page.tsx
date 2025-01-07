import { Onboarding } from "@/app/onboarding/onboarding";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-3">
      <h1 className="text-ceter text-3xl">
        Welcome, <span className="ml-2 font-bold ">{user.firstName}! 👋</span>
      </h1>
      <Separator />
      <Onboarding userId={user.id} />
    </div>
  );
};

export default page;
