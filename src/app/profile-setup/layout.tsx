import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex items-center justify-center w-full h-dvh">
      {children}
    </div>
  );
};

export default layout;
