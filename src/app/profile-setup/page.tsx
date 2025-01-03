import { ProfileUpdateModal } from "@/components/modals/ProfileUpdateModal";
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
        Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋</span>
      </h1>
      <h2 className="mt-4 text-center text-base text-muted-foreground">
        Let &apos;s get started by providing some information about yourself.
      </h2>
      <h3 className="my-2 text-center text-sm text-muted-foreground">
        You can update these details later in your account settings.
      </h3>
      <Separator />
      <ProfileUpdateModal userId={user.id} />
    </div>
  );
};

export default page;
