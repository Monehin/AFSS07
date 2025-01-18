import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";
import { getProfile } from "../actions/getProfile";
import Confirmation from "./Forms/Confirmation";
import { Onboarding } from "./onboarding";
import { getUser } from "../actions/getUser";

const page = async () => {
  const user = await currentUser();
  await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const profile = await getProfile();

  const { data } = profile || {};
  const { user: pUser } = data || {};

  if (user) {
    if (!pUser?.verified) {
      return <Confirmation />;
    }

    if (pUser?.verified) {
      redirect("/");
    }
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
