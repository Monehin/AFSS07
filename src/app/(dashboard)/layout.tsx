import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
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
