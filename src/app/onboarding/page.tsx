import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";
import { getProfile } from "../actions/getProfile";
import Confirmation from "./Forms/Confirmation";
import { SimpleForm } from "./Forms/SimpleForm";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const profile = await getProfile();

  if (profile.data && !profile.data.user.verified) {
    return <Confirmation />;
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-3">
      <h1 className="text-ceter text-3xl">
        Welcome, <span className="ml-2 font-bold ">{user.firstName}! 👋</span>
      </h1>
      <Separator />
      <SimpleForm />
    </div>
  );
};

export default page;
