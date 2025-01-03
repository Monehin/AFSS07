import Image from "next/image";
import { ReactNode } from "react";
import { ThemeToggle } from "../../components/ThemeToggle";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-dvh dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center w-full">
      {/* ThemeToggle moved to the top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-x-12">
        <div>
          <Image
            className="md:h-52 md:w-52  inset-0 object-cover"
            src="/AFSS07-logo.png"
            width={100}
            height={100}
            alt="AFSS07"
          />
        </div>
        <div className="flex flex-col gap-y-3 justify-center items-center mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
