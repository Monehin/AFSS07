import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getUser } from "../actions/getUser";

const layout = async ({ children }: { children: ReactNode }) => {
  const { data: user } = await getUser();
  if (user && !user.verified) {
    redirect("/onboarding");
  }
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-8">
        {children}
      </div>
    </div>
  );
};

export default layout;
