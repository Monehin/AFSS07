import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getUser } from "../actions/getUser";

const layout = async ({ children }: { children: ReactNode }) => {
  const { data: user } = await getUser();
  if (user && !user.verified) {
    redirect("/profile-setup");
  }
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="d">
          <h1 className="text-xl font-bold">Hello {user && user.name} 👋</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
